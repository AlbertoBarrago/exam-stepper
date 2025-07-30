import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import {
  IdValueSchema,
  QuestionSchema,
  AudioQuestionSchema,
} from '@/types/zodValidation/stepTypes.zod';
import { Step } from '@/types/stepTypes';

export async function GET() {
  try {
    const steps = await query<Step[]>({ query: 'SELECT * FROM steps ORDER BY id ASC' });

    const stepsWithDetails = await Promise.all(
      steps.map(async (step) => {
        switch (step.kind) {
          case 'reading-question':
            const readingOptions = await query<z.infer<typeof IdValueSchema>[]>({
              query: 'SELECT * FROM reading_options WHERE step_id = ?',
              values: [step.id],
            });
            return { ...step, options: readingOptions };

          case 'reading-question-list':
            const readingQuestions = await query<z.infer<typeof QuestionSchema>[]>({
              query: 'SELECT * FROM reading_questions WHERE step_id = ?',
              values: [step.id],
            });
            // Fetch the options for each question in parallel
            const readingQuestionsWithDetails = await Promise.all(
              readingQuestions.map(async (question) => {
                const options = await query<z.infer<typeof IdValueSchema>[]>({
                  query: 'SELECT * FROM reading_question_options WHERE question_id = ?',
                  values: [question.id],
                });
                return { ...question, options };
              })
            );
            return { ...step, questions: readingQuestionsWithDetails };

          case 'listening-question':
            const listeningQuestions = await query<z.infer<typeof AudioQuestionSchema>[]>({
              query: 'SELECT * FROM listening_questions WHERE step_id = ?',
              values: [step.id],
            });
            // Fetch the options for each question in parallel
            const listeningQuestionsWithDetails = await Promise.all(
              listeningQuestions.map(async (question) => {
                const options = await query<z.infer<typeof IdValueSchema>[]>({
                  query: 'SELECT * FROM listening_question_options WHERE question_id = ?',
                  values: [question.id],
                });
                return { ...question, options };
              })
            );
            return { ...step, questions: listeningQuestionsWithDetails };

          case 'speaking-question':
            return step;

          default:
            return step;
        }
      })
    );

    return NextResponse.json(stepsWithDetails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
