import {NextResponse} from 'next/server';
import {Step} from "@/types/stepTypes";

const StepsConfig: Step[] = [
    {
        id: 0,
        kind: 'welcome',
        title: 'Welcome'
    },
    {
        id: 0,
        kind: 'permission',
        title: 'Audio Check'
    },
    {
        id: 1,
        kind: 'reading-intro',
        title: 'Reading Section Intro',
        subTitle: 'You are about to start the reading section.'
    },
    {
        id: 2,
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
            }
        ],
    },
    {
        id: 3,
        kind: 'reading-complete',
        title: 'Reading Complete',
    },
    {
        id: 4,
        kind: 'listening-intro',
        title: 'Listening Section Intro',
    },
    {
        id: 5,
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
        id: 6,
        kind: 'listening-complete',
        title: 'Listening Complete',
    },
    {
        id: 7,
        kind: 'writing-intro',
        title: 'Writing Section Intro',
    },
    {
        id: 8,
        kind: 'writing-question',
        title: 'Writing',
    },
    {
        id: 9,
        kind: 'writing-complete',
        title: 'Writing Complete',
    },
    {
        id: 10,
        kind: 'speaking-intro',
        title: 'Speaking Section',
    },
    {
        id: 11,
        kind: 'speaking-question',
        title: 'Speaking',
        durationMs: 10000,
    },
    {
        id: 12,
        kind: 'speaking-complete',
        title: 'Speaking',
    },
    {
        id: 13,
        kind: 'final',
        title: 'Exam complete'
    }
];

export async function GET() {
    return NextResponse.json(StepsConfig);
}