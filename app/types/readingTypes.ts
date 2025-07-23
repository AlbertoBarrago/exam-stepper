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
    id: string;
    question: string;
    options: string[];
    type: 'single' | 'multiple';
}

export type ReadingPassageProps = {
    passage: string;
    questions: Question[];
    currentQuestionIndex?: number;
    onAnswerChange: (questionId: string, answer: number | number[]) => void;
    onNextAction: () => void;
    onPrevious?: () => void;
    answers: Record<string, number | number[]>;
    showPrevious?: boolean;
}