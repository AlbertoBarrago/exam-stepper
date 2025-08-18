import { createClient } from '@/utils/supabase';
import { NextResponse } from 'next/server';
import { Step } from '@/types/stepTypes';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: steps, error: stepsError } = await supabase
      .from('steps')
      .select('*')
      .order('id', { ascending: true });

    if (stepsError || !steps) {
      console.error('Supabase steps fetch error:', stepsError);
      throw stepsError || new Error('No steps found');
    }

    console.log('Fetched raw steps from Supabase:', steps);

    const stepsWithDetails = steps.map((step) => {
      switch (step.kind) {
        case 'reading-question':
          if (step.questions && Array.isArray(step.questions) && step.questions.length > 0) {
            const questionData = step.questions[0];
            if (questionData.options) {
              return { ...step, options: questionData.options } as Step;
            }
          }
          return step;

        case 'reading-question-list':
          return { ...step, questions: step.questions } as Step;

        case 'listening-question':
          return { ...step, questions: step.questions } as Step;

        case 'speaking-question':
          return { ...step, audioUrl: step.audio_url };

        default:
          return step;
      }
    });

    console.log('Processed steps data sent to client:', stepsWithDetails);
    return NextResponse.json(stepsWithDetails);
  } catch (error: unknown) {
    console.error('Error in /api/steps GET request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
