import {NextResponse} from 'next/server';
import {Step} from "@/types/stepTypes";

const StepsConfig: Step[] = [
    {
        id: 0,
        kind: 'welcome',
        title: 'Welcome'
    },
    {
        id: 1,
        kind: 'permission',
        title: 'Audio Check'
    },
    {
        id: 1,
        kind: 'reading-intro',
        title: 'Reading Section Intro',
        subTitle: 'You are about to start the reading section.',
        durationMs: 1200000
    },
    {
        id: 1.1,
        kind: 'reading-question',
        title: 'Reading',
        sentence: "France is a good ____ for tourists.",
        options: [{id: 1, value: 'walk'}, {id: 2, value: 'play'}, {id: 3, value: 'traveling'}],
    },
    {
        id: 1.2,
        kind: 'reading-question-list',
        title: 'Reading',
        passage: "The Hidden World of Underground Markets\n\nBeneath the bustling streets of major cities around the world lies a fascinating network of underground markets that have operated for centuries. These subterranean commercial spaces, carved out of natural caves, abandoned subway tunnels, or purpose-built underground chambers, represent a unique form of urban commerce that thrives away from the surface world's regulations and oversight.\n\nIn Tokyo, the sprawling underground shopping complexes beneath major train stations have evolved into legitimate commercial districts. However, deeper below, in forgotten maintenance tunnels and abandoned sections of the old subway system, informal markets have emerged where vendors sell everything from vintage electronics to rare collectibles. These markets operate on a cash-only basis and rely heavily on word-of-mouth advertising.\n\nSimilarly, in Paris, the famous catacombs have spawned numerous unauthorized markets in adjacent tunnel systems. Here, traders gather weekly to exchange rare books, antique maps, and historical artifacts. The atmosphere is both mysterious and entrepreneurial, with transactions conducted by candlelight and hushed negotiations echoing through stone corridors.\n\nThe appeal of these underground markets extends beyond mere commerce. For many participants, they represent a form of urban exploration and community building. Regular customers and vendors form tight-knit networks, sharing information about new locations, upcoming events, and valuable items. The secrecy and exclusivity create a sense of belonging that traditional retail environments cannot replicate.\n\nHowever, these markets also face significant challenges. Legal issues surrounding permits, taxation, and safety regulations create constant uncertainty. Authorities regularly conduct raids, forcing markets to relocate or operate even more discreetly. Additionally, the lack of proper ventilation, lighting, and emergency exits poses genuine safety risks to participants.\n\nDespite these challenges, underground markets continue to flourish, adapting to technological changes and urban development. Some have embraced digital communication methods to coordinate meetings and share information, while others have partnered with legitimate businesses to create hybrid above-ground and below-ground operations. As cities continue to grow and evolve, these hidden commercial networks will likely find new ways to survive and thrive in the urban underground.",
        questions: [
            {
                "id": "q1",
                "question": "According to the passage, underground markets operate in which of the following locations?",
                "type": "multiple",
                "options": [
                    {id: 1, value: "Natural caves"},
                    {id: 2, value: "Abandoned subway tunnels"},
                    {id: 3, value: "Purpose-built underground chambers"},
                    {id: 4, value: "Active shopping malls"},
                    {id: 5, value: "Rooftop spaces"}
                ]
            },
            {
                "id": "q2",
                "question": "What is the primary payment method used in Tokyo's underground markets?",
                "type": "single",
                "options": [
                    {id: 1, value: "Credit cards only"},
                    {id: 2, value: "Cash only"},
                    {id: 3, value: "Digital payments"},
                    {id: 4, value: "Barter system"}
                ]
            },
            {
                "id": "q3",
                "question": "Which challenges do underground markets face?",
                "type": "multiple",
                "options": [
                    {id: 1, value: "Legal issues with permits and taxation"},
                    {id: 2, value: "Safety regulation concerns"},
                    {id: 3, value: "Authority raids forcing relocation"},
                    {id: 4, value: "Lack of proper ventilation and lighting"},
                    {id: 5, value: "Competition from online retailers"}
                ]
            },
            {
                "id": "q4",
                "question": "In Paris, the underground markets primarily deal in:",
                "type": "single",
                "options": [
                    {id: 1, value: "Fresh food and groceries"},
                    {id: 2, value: "Electronics and gadgets"},
                    {id: 3, value: "Rare books and historical artifacts"},
                    {id: 4, value: "Clothing and accessories"}
                ]
            },
            {
                "id": "q5",
                "question": "What creates a sense of belonging in underground markets according to the passage?",
                "type": "single",
                "options": [
                    {id: 1, value: "Low prices and discounts"},
                    {id: 2, value: "Modern facilities and amenities"},
                    {id: 3, value: "Secrecy and exclusivity"},
                    {id: 4, value: "Government endorsement"}
                ]
            }
        ],
        componentProps: {
            "currentQuestionIndex": 0,
            "answers": {},
            "showPrevious": false
        },
        sampleAnswers: {
            "q1": [0, 1, 2],
            "q2": 1,
            "q3": [0, 1, 2, 3],
            "q4": 2,
            "q5": 2
        }
    },
    {
        id: 1.3,
        kind: 'reading-complete',
        title: 'Reading Complete',
    },
    {
        id: 2,
        kind: 'listening-intro',
        title: 'Listening Section Intro',
        subTitle: 'Now you have to listen some audio',
        durationMs: 1200000
    },
    {
        id: 2.1,
        kind: 'listening-question',
        title: 'Listening',
        audioUrl: '/audio/listening.mp3',
        questions: [
            {
                id: 1,
                before: "The speaker thinks the weather is",
                options: [{
                    id: 1,
                    value: "sunny"
                }, {
                    id: 2,
                    value: "cloudy"
                },{
                    id: 3,
                    value: "rainy"
                }],
                correctAnswer: {
                    id: 1,
                    value:"sunny"},
            },
            {
                id: 2,
                before: "The conversation is about",
                options: [{
                    id: 1,
                    value: "the weather"
                }, {
                    id: 2,
                    value: "the sun"
                },{
                    id: 3,
                    value: "the moon"
                }],
                correctAnswer: {
                    id: 2,
                    value:"the sun"},
            },
            {
                id: 3,
                before: "The subject is about",
                options: [{
                    id: 1,
                    value: "a men"
                }, {
                    id: 2,
                    value: "a dog"
                },{
                    id: 3,
                    value: "a cat"
                }],
                correctAnswer: {
                    id: 3,
                    value:"a cat"},
            },
        ],
    },
    {
        id: 2.2,
        kind: 'listening-complete',
        title: 'Listening Complete',
    },
    {
        id: 3,
        kind: 'writing-intro',
        title: 'Writing Section Intro',
        subTitle: 'Now you have write some content',
        durationMs: 2100000
    },
    {
        id: 3.1,
        kind: 'writing-question',
        title: 'Writing',
    },
    {
        id: 3.2,
        kind: 'writing-complete',
        title: 'Writing Complete',
    },
    {
        id: 4,
        kind: 'speaking-intro',
        title: 'Speaking Section',
        subTitle: 'Now you have speaking a little',
        durationMs: 900000
    },
    {
        id: 4.1,
        kind: 'speaking-question',
        title: 'Speaking',
        durationMs: 10000,
    },
    {
        id: 4.2,
        kind: 'speaking-complete',
        title: 'Speaking',
    },
    {
        id: 5,
        kind: 'final',
        title: 'Exam complete'
    }
];

export async function GET() {
    return NextResponse.json(StepsConfig);
}