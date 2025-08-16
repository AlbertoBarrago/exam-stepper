import { IdValue } from '@/types/stepTypes';

export type ReadingQuestionProps = {
  questionNumber?: number;
  totalQuestions?: number;
  sentence: string;
  options?: IdValue[];
  onNextAction?: (selectedAnswer: number) => void;
  onAnswerChangeAction?: (optionIndex: number) => void;
  initialAnswer?: number | null;
};

export type Question = {
  id: number;
  question: string;
  options: IdValue[];
  type: 'single' | 'multiple';
  correctAnswer: number | number[];
};

export type ReadingPassageProps = {
  passage: string;
  questions: Question[];
  currentQuestionIndex?: number;
  onAnswerChange: (questionId: number, answer: number | number[]) => void;
  onNextAction: () => void;
  onPrevious?: () => void;
  answers: Record<number, number | number[]>;
  showPrevious?: boolean;
};

export type QuestionListProps = {
  questions: Question[];
  passage: string;
  onNextAction: (results: boolean[]) => void;
};
