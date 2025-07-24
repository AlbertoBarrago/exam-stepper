export type IdValue = {
  id: number;
  value: string;
};

export type AudioQuestion = {
  id: number;
  before: string;
  options: IdValue[];
  correctAnswer: IdValue;
};

export interface Question {
  id: number;
  question: string;
  options: IdValue[];
  type: 'single' | 'multiple';
}

// Union type, ts trick
type SimpleStepKind =
  | 'welcome'
  | 'permission'
  | 'reading-complete'
  | 'listening-complete'
  | 'writing-question'
  | 'writing-complete'
  | 'speaking-complete'
  | 'final';

type IntroStepKind = 'reading-intro' | 'listening-intro' | 'writing-intro' | 'speaking-intro';

export type Step =
  | { id: number; kind: 'reading-question'; title: string; sentence: string; options: IdValue[] }
  | {
      id: number;
      kind: 'reading-question-list';
      title: string;
      passage: string;
      questions: Question[];
      componentProps: object;
      sampleAnswers: object;
    }
  | {
      id: number;
      kind: 'listening-question';
      title: string;
      audioUrl: string;
      questions: AudioQuestion[];
    }
  | { id: number; kind: 'speaking-question'; title: string; durationMs: number }
  | { id: number; kind: IntroStepKind; title: string; subTitle: string; durationMs: number }
  | { id: number; kind: SimpleStepKind; title: string };
