export type Step =
    | { kind: 'welcome'; title: string; html: string }
    | { kind: 'audio'; title: string; audioUrl: string, questions: AudioQuestion[]; }
    | { kind: 'choice'; title: string; sentence: string; options: string[]; correct: string }
    | { kind: 'speak'; title: string, durationMs: number }
    | { kind: 'final'; title: string };

export type AudioQuestion = {
    id: number;
    before: string;
    options: string[];
    correctAnswer: string;
};


export const STEPS: Step[] = [
    {
        kind: 'welcome', title: 'Welcome', html:
            `<p>You will take a short demo test.<br />
     There are three parts: listening, reading, and speaking.</p>`
    },
    {
        kind: 'audio',
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
        kind: 'choice',
        title: 'Reading',
        sentence: 'France is a good ____ for tourists.',
        options: ['walk', 'play', 'traveling'],
        correct: 'traveling',
    },
    {kind: 'speak', title: 'Speaking', durationMs: 10000}, //2 minutes -> 120000
    {kind: 'final', title: 'Exam complete'}
];
