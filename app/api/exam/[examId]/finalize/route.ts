import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';
import { calculateFinalScore } from '@/services/score';
import { StepResult } from '@/types/commonTypes';

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  try {
    const { examId: examIdString } = await params;
    const examId = parseInt(examIdString, 10);

    if (isNaN(examId)) {
      return NextResponse.json({ success: false, error: 'Invalid examId.' }, { status: 400 });
    }

    if (!examId) {
      return NextResponse.json({ success: false, error: 'Missing examId.' }, { status: 400 });
    }

    const { cefrLevelData, stepScoresData } = await req.json();

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

    const { data, error: updateError } = await supabase
      .from('exams')
      .update({ final_score: finalScore, cefr_level: cefrLevelData, step_scores: stepScoresData }) // Use cefrLevelData and stepScoresData here
      .eq('id', examId)
      .select();

    if (updateError) {
      console.error('Error updating exam with final score:', updateError);
      console.error(
        'Supabase update error details:',
        updateError.message,
        updateError.details,
        updateError.hint,
        updateError.code
      );
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }
    console.log('Supabase update successful. Data:', data);

    return NextResponse.json({ success: true, finalScore, exam: data ? data[0] : null });
  } catch (e) {
    const error = e as Error;
    console.error('Error processing finalization request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
