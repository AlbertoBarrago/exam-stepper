import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId, stepIds } = await req.json();

    if (!userId || !stepIds || !Array.isArray(stepIds) || stepIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or stepIds.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Create a new exam entry
    const { data: examData, error: examError } = await supabase
      .from('exams')
      .insert({ user_id: userId })
      .select();

    if (examError) {
      console.error('Error creating exam:', examError);
      return NextResponse.json({ success: false, error: examError.message }, { status: 500 });
    }

    const examId = examData[0].id;

    const examStepsToInsert = stepIds.map((stepId: number, index: number) => ({
      exam_id: examId,
      step_id: stepId,
      step_order: index,
    }));

    const { data: examStepsData, error: examStepsError } = await supabase
      .from('exam_steps')
      .insert(examStepsToInsert)
      .select();

    if (examStepsError) {
      console.error('Error creating exam steps:', examStepsError);
      return NextResponse.json({ success: false, error: examStepsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, examId, examSteps: examStepsData });
  } catch (e) {
    const error = e as Error;
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
