import {IdValue} from "@/types/stepTypes";

export type ReadingQuestionProps = {
    questionNumber?: number;
    totalQuestions?: number;
    sentence: string;
    options?: string[];
    onNextAction?: (selectedAnswer: number) => void;
    onAnswerChangeAction?: (optionIndex: number) => void;
    initialAnswer?: number | null;
}

export type Question = {
    id: number;
    question: number;
    options: IdValue[];
    type: 'single' | 'multiple';
}

export type ReadingPassageProps = {
    passage: string;
    questions: Question[];
    currentQuestionIndex?: number;
    onAnswerChange: (questionId: number, answer: number | number[]) => void;
    onNextAction: () => void;
    onPrevious?: () => void;
    answers: Record<number, number | number[]>;
    showPrevious?: boolean;
}