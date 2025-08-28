import { z } from 'zod';
import {
  StepSchema,
  IdValueSchema,
  AudioQuestionSchema,
  StepResultSchema,
} from '@/types/zodValidation/stepTypes.zod';

export type IdValue = z.infer<typeof IdValueSchema>;
export type AudioQuestion = z.infer<typeof AudioQuestionSchema>;
export type Step = z.infer<typeof StepSchema>;
export type StepResult = z.infer<typeof StepResultSchema>;

export type CertificateProps = {
  name: string;
  overallScore: string;
  overallLevel: string;
  awardedDate: string;
  stepScores: { [key: string]: number } | null;
  readingCefrLevel?: string;
  listeningCefrLevel?: string;
  speakingCefrLevel?: string;
  writingCefrLevel?: string;
};

export type StepState = {
  steps: Step[];
  fetchSteps: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};
