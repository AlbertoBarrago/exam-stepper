import { NextResponse } from 'next/server';
import {Step} from "@/types/stepTypes";

const StepsConfig: Step[] = [
    {
        kind: 'welcome',
        title: 'Welcome'
    },
    {kind: 'permission', title: 'Audio Check'},
    {
        kind: 'reading-intro',
        title: 'Reading Section Intro',
        subTitle: 'You are about to start the reading section.'
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
            }
        ],
    },
    {
        kind: 'reading-complete',
        title: 'Reading Complete',
    },
    {
        kind: 'listening-intro',
        title: 'Listening Section Intro',
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
        kind: 'writing-intro',
        title: 'Writing Section Intro',
    },
    {
        kind: 'writing-question',
        title: 'Writing',
    },
    {
        kind:'writing-complete',
        title: 'Writing Complete',
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
        kind: 'speaking-complete',
        title: 'Speaking',
        durationMs: 10000,
    },
    {
        kind: 'final',
        title: 'Exam complete'
    }
];

export async function GET() {
    return NextResponse.json(StepsConfig);
}