export type Step =
    | { kind: 'welcome'; title: string; html: string }
    | { kind: 'audio';   title: string; audioUrl: string; durationMs: number }
    | { kind: 'fill';    title: string; html: string; answer: string }
    | { kind: 'speak';   title: string; durationMs: number };

export const STEPS: Step[] = [
    { kind: 'welcome', title: 'Welcome', html:
            `<p>You will take a short demo test.<br />
     There are three parts: listening, reading, and speaking.</p>` },

    { kind: 'audio',   title: 'Listening',
        audioUrl: '/sample/listening.mp3',
        durationMs: 30_000 },

    { kind: 'fill',    title: 'Reading — Fill the blank',
        html: `The quick brown fox jumps over the ___ dog.`,
        answer: 'lazy' },

    { kind: 'speak',   title: 'Speaking — Describe the picture',
        durationMs: 40_000 },
];
