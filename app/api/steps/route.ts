import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server';
import { Step } from '@/types/stepTypes';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: steps, error: stepsError } = await supabase
      .from('steps')
      .select('*')
      .order('id', { ascending: true });

    if (stepsError || !steps) {
      throw stepsError || new Error('No steps found');
    }

    const stepsWithDetails = await Promise.all(
      steps.map(async (step) => {
        switch (step.kind) {
          case 'reading-question':
            const { data: readingOptions, error: readingOptionsError } = await supabase
              .from('reading_options')
              .select('*')
              .eq('step_id', step.id);

            if (readingOptionsError || !readingOptions) {
              throw readingOptionsError || new Error('No reading options found');
            }

            return { ...step, options: readingOptions } as Step;

          case 'reading-question-list':
            const { data: readingQuestions, error: readingQuestionsError } = await supabase
              .from('reading_questions')
              .select('*')
              .eq('step_id', step.id);

            if (readingQuestionsError || !readingQuestions) {
              throw readingQuestionsError || new Error('No reading questions found');
            }

            const readingQuestionsWithDetails = await Promise.all(
              readingQuestions.map(async (question) => {
                const { data: options, error: optionsError } = await supabase
                  .from('reading_question_options')
                  .select('*')
                  .eq('question_id', question.id);

                if (optionsError || !options) {
                  throw optionsError || new Error('No reading question options found');
                }
                return { ...question, options };
              })
            );
            return { ...step, questions: readingQuestionsWithDetails } as Step;

          case 'listening-question':
            const { data: listeningQuestions, error: listeningQuestionsError } = await supabase
              .from('listening_questions')
              .select('*')
              .eq('step_id', step.id);

            if (listeningQuestionsError || !listeningQuestions) {
              throw listeningQuestionsError || new Error('No listening questions found');
            }
            const listeningQuestionsWithDetails = await Promise.all(
              listeningQuestions.map(async (question) => {
                const { data: options, error: optionsError } = await supabase
                  .from('listening_question_options')
                  .select('*')
                  .eq('question_id', question.id);

                if (optionsError || !options) {
                  throw optionsError || new Error('No listening question options found');
                }
                return { ...question, options };
              })
            );
            return { ...step, questions: listeningQuestionsWithDetails } as Step;

          case 'speaking-question':
            return { ...step, audioUrl: step.audioUrl };

          default:
            return step;
        }
      })
    );

    return NextResponse.json(stepsWithDetails);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
