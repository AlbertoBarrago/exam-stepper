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

export type Step =
    | { kind: 'welcome'; title: string; }
    | { kind: 'permission'; title: string;}
    | { kind: 'reading-intro'; title: string, subTitle: string}
    | { kind: 'reading-question'; title: string; sentenceList: Sentence[] }
    | { kind: 'reading-complete'; title: string }
    | { kind: 'listening-intro'; title: string }
    | { kind: 'listening-question'; title: string; audioUrl: string; questions: AudioQuestion[] }
    | { kind: 'listening-complete'; title: string }
    | { kind: 'writing-intro'; title: string }
    | { kind: 'writing-question'; title: string }
    | { kind: 'writing-complete'; title: string }
    | { kind: 'speaking-intro'; title: string }
    | { kind: 'speaking-question'; title: string; durationMs: number }
    | { kind: 'speaking-complete'; title: string; durationMs: number }
    | { kind: 'final'; title: string };
