export type AudioQuestion = {
    id: number;
    before: string;
    options: string[];
    correctAnswer: string;
};

export type Sentence = {
    title: string;
    sentence: string;
    options: string[];
    correct: string;
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
    | { id: number; kind: 'reading-question'; title: string; sentenceList: Sentence[] }
    | { id: number; kind: 'listening-question'; title: string; audioUrl: string; questions: AudioQuestion[] }
    | { id: number; kind: 'speaking-question'; title: string; durationMs: number }
    | { id: number; kind: SimpleStepKind; title: string };

