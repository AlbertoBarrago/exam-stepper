export type Step =
    | { kind: 'welcome'; title: string; html: string }
    | { kind: 'audio'; title: string; audioUrl: string }
    | { kind: 'choice'; title: string; sentence: string; options: string[]; correct: string }
    | { kind: 'speak'; title: string, durationMs: number }
    | { kind: 'final'; title: string };

export const STEPS: Step[] = [
    {
        kind: 'welcome', title: 'Welcome', html:
            `<p>You will take a short demo test.<br />
     There are three parts: listening, reading, and speaking.</p>`
    },
    {
        kind: 'audio',
        title: 'Listening',
        audioUrl: '/audio/listening.mp3'
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
