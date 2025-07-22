export type AudioQuestion = {
    id: number;
    before: string;
    options: string[];
    correctAnswer: string;
};

export type Sentence = {
    sentence: string;
    options: string[];
    passage?: string;
    correct: string;
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    type: 'single' | 'multiple';
}

// Union type, ts trick
type SimpleStepKind =
    | 'welcome'
    | 'permission'
    | 'reading-complete'
    | 'listening-intro'
    | 'listening-complete'
    | 'writing-intro'
    | 'writing-question'
    | 'writing-complete'
    | 'speaking-intro'
    | 'speaking-complete'
    | 'final';


export type Step =
    | { id: number; kind: 'reading-intro'; title: string; subTitle: string }
    | { id: number; kind: 'reading-question'; title: string; sentence: string, options: string[] }
    | { id: number; kind: 'reading-question-list'; title: string; passage: string, questions: Question[], componentProps: object, sampleAnswers: object}
    | { id: number; kind: 'listening-question'; title: string; audioUrl: string; questions: AudioQuestion[] }
    | { id: number; kind: 'speaking-question'; title: string; durationMs: number }
    | { id: number; kind: SimpleStepKind; title: string };

