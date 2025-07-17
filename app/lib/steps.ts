export type Step =
    | { kind: 'welcome'; title: string; html: string }
    | { kind: 'reading-intro'; title: string }
    | { kind: 'reading-question'; title: string; sentenceList: Sentence[] }
    | { kind: 'reading-complete'; title: string }
    | { kind: 'listening-intro'; title: string }
    | { kind: 'listening-question'; title: string; audioUrl: string; questions: AudioQuestion[] }
    | { kind: 'listening-complete'; title: string }
    | { kind: 'speaking-intro'; title: string }
    | { kind: 'speaking-question'; title: string; durationMs: number }
    | { kind: 'final'; title: string };

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

export const STEPS: Step[] = [
    {
        kind: 'welcome',
        title: 'Welcome',
        html: `<h1 class="text-4xl">You will take a short demo test.</h1> <br />
            <p class="text-2xl">There are three parts: listening, reading, and speaking.</p>`
    },
    {
        kind: 'reading-intro',
        title: 'Reading Section',
    },
    {
        kind: 'reading-question',
        title: 'Reading',
        sentenceList: [
            {
                title: 'Reading',
                sentence: 'France is a good ____ for tourists.',
                options: ['walk', 'play', 'traveling'],
                correct: 'traveling',
            },
            {
                title: 'Reading',
                sentence: 'The train leaves at ____. Don’t be late.',
                options: ['morning', '7pm', 'food'],
                correct: '7pm',
            },
            {
                title: 'Reading',
                sentence: 'Lisa wants to ____ a cake for her birthday.',
                options: ['eat', 'bake', 'sleep'],
                correct: 'bake',
            },
            {
                title: 'Reading',
                sentence: 'They ____ to the beach every summer.',
                options: ['go', 'run', 'think'],
                correct: 'go',
            },
            {
                title: 'Reading',
                sentence: 'His favorite color is ____.',
                options: ['book', 'blue', 'apple'],
                correct: 'blue',
            },
        ],
    },
    {
        kind: 'reading-complete',
        title: 'Reading Complete',
    },
    {
        kind: 'listening-intro',
        title: 'Listening Section',
    },
    {
        kind: 'listening-question',
        title: 'Listening',
        audioUrl: '/audio/listening.mp3',
        questions: [
            {
                id: 1,
                before: "The speaker thinks the weather is",
                options: ["sunny", "cloudy", "rainy"],
                correctAnswer: "sunny",
            },
            {
                id: 2,
                before: "The conversation is about",
                options: ["the weather", "the sun", "the moon"],
                correctAnswer: "the sun",
            }
        ],
    },
    {
        kind: 'listening-complete',
        title: 'Listening Complete',
    },
    {
        kind: 'speaking-intro',
        title: 'Speaking Section',
    },
    {
        kind: 'speaking-question',
        title: 'Speaking',
        durationMs: 10000,
    },
    {
        kind: 'final',
        title: 'Exam complete'
    }
];