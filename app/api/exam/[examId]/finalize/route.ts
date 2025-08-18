import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';
import { calculateFinalScore, mapToCEFR } from '@/services/scoringService';
import { StepResult } from '@/types/commonTypes';

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  try {
    const { examId } = await params;

    if (!examId) {
      return NextResponse.json({ success: false, error: 'Missing examId.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: examSteps, error: examStepsError } = await supabase
      .from('exam_steps')
      .select('raw_score, max_score, steps(kind)')
      .eq('exam_id', examId);

    if (examStepsError) {
      console.error('Error fetching exam steps for finalization:', examStepsError);
      return NextResponse.json({ success: false, error: examStepsError.message }, { status: 500 });
    }

    if (!examSteps || examSteps.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No step results found for this exam.' },
        { status: 404 }
      );
    }

    const results: StepResult[] = examSteps.map((es) => {
      const stepData = Array.isArray(es.steps) ? es.steps[0] : es.steps;
      return {
        step: stepData?.kind as StepResult['step'],
        rawScore: es.raw_score,
        maxScore: es.max_score,
      };
    });

    const validResults = results.filter((r) => r.rawScore !== null && r.maxScore !== null);

    const finalScore = calculateFinalScore(validResults);
    const cefrLevel = mapToCEFR(finalScore);

    const { data, error: updateError } = await supabase
      .from('exams')
      .update({ final_score: finalScore, cefr_level: cefrLevel })
      .eq('id', examId)
      .select();

    if (updateError) {
      console.error('Error updating exam with final score:', updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, finalScore, cefrLevel, exam: data ? data[0] : null });
  } catch (e) {
    const error = e as Error;
    console.error('Error processing finalization request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
