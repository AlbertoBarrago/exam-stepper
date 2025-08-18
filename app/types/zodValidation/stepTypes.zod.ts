import { z } from 'zod';

export const IdValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  is_correct: z.boolean().optional(),
});

export const AudioQuestionSchema = z.object({
  id: z.number(),
  before: z.string(),
  options: z.array(IdValueSchema),
});

export const QuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(IdValueSchema),
  type: z.union([z.literal('single'), z.literal('multiple')]),
});

export const ComponentPropsSchema = z.object({
  currentQuestionIndex: z.number(),
  answers: z.record(z.string(), z.union([z.number(), z.array(z.number())])),
  showPrevious: z.boolean(),
});

export const SampleAnswersSchema = z.record(z.string(), z.union([z.number(), z.array(z.number())]));

const SimpleStepKindSchema = z.union([
  z.literal('welcome'),
  z.literal('permission'),
  z.literal('reading-complete'),
  z.literal('listening-complete'),
  z.literal('writing-question'),
  z.literal('writing-complete'),
  z.literal('speaking-complete'),
  z.literal('final'),
]);

const StartStepKindSchema = z.union([
  z.literal('reading-login'),
  z.literal('listening-login'),
  z.literal('writing-login'),
  z.literal('speaking-login'),
  z.literal('speaking-question-list-login'),
]);

const SpeakingStepKindSchema = z.literal('speaking-question');

export const StepSchema = z.union([
  z.object({
    id: z.number(),
    kind: z.literal('reading-question'),
    title: z.string(),
    sentence: z.string(),
    options: z.array(IdValueSchema),
  }),
  z.object({
    id: z.number(),
    kind: z.literal('reading-question-list'),
    title: z.string(),
    passage: z.string(),
    questions: z.array(QuestionSchema),
    componentProps: ComponentPropsSchema,
    sampleAnswers: SampleAnswersSchema,
  }),
  z.object({
    id: z.number(),
    kind: z.literal('listening-question'),
    title: z.string(),
    audioUrl: z.string(),
    questions: z.array(AudioQuestionSchema),
  }),
  z.object({
    id: z.number(),
    kind: StartStepKindSchema,
    title: z.string(),
    subTitle: z.string(),
    durationMs: z.number(),
    recordMs: z.number().optional(),
  }),
  z.object({
    id: z.number(),
    kind: SpeakingStepKindSchema,
    title: z.string(),
    audioUrl: z.string(),
    recordMs: z.number().optional(),
  }),
  z.object({ id: z.number(), kind: SimpleStepKindSchema, title: z.string() }),
]);
