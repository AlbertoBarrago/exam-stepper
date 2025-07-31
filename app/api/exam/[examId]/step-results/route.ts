import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  try {
    const { examId } = await params;

    if (!examId) {
      return NextResponse.json({ success: false, error: 'Missing examId.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: examSteps, error: examStepsError } = await supabase
      .from('exam_steps')
      .select('raw_score, max_score, step_id, steps(kind)')
      .eq('exam_id', examId);

    if (examStepsError) {
      console.error('Error fetching exam steps:', examStepsError);
      return NextResponse.json({ success: false, error: examStepsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, examSteps });
  } catch (e) {
    const error = e as Error;
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
