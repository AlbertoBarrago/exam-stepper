import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    // We need examId to identify the exam session and stepId to identify the specific step.
    const { examId, stepId, rawScore, maxScore } = await req.json();

    if (!examId || !stepId || rawScore === undefined || maxScore === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the specific exam_step entry and update it.
    // We use .match() to filter on the composite primary key or unique constraint.
    const { data, error } = await supabase
      .from('exam_steps')
      .update({
        raw_score: rawScore,
        max_score: maxScore,
      })
      .match({ exam_id: examId, step_id: stepId })
      .select(); // .select() returns the updated row, which is good for debugging.

    if (error) {
      console.error('Supabase error updating exam_steps:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Exam step not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (e) {
    const error = e as Error;
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
