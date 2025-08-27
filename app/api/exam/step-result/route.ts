import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';
import { normalizeScore } from '@/services/scoringService';

export async function POST(req: NextRequest) {
  try {
    const { examId, stepId, rawScore, maxScore } = await req.json();

    if (!examId || !stepId || rawScore === undefined || maxScore === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const normalizedScore = normalizeScore(rawScore, maxScore);

    // Find the specific exam_step entry and update it.
    // We use .match() to filter on the composite primary key or unique constraint.
    const { data, error } = await supabase
      .from('exam_steps')
      .update({
        raw_score: rawScore,
        max_score: maxScore,
        normalized_score: normalizedScore,
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

export async function PUT(req: NextRequest) {
  try {
    console.log('Request body:', await req.clone().json());
    const { exam_id, step_id, visited, time_spent_ms } = await req.json();

    if (!exam_id || !step_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: { visited?: boolean; time_spent_ms?: number } = {};
    if (visited !== undefined) {
      updateData.visited = visited;
    }
    if (time_spent_ms !== undefined) {
      updateData.time_spent_ms = time_spent_ms;
    }
    console.log('Update data:', updateData);

    const { data, error } = await supabase
      .from('exam_steps')
      .update(updateData)
      .match({ exam_id: exam_id, step_id: step_id })
      .select();

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
