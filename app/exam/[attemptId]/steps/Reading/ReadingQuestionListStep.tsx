import ReadingQuestionList from '@/components/steps/ReadingTaskList';
import { useState } from 'react';
import { QuestionListProps } from '@/types/readingTypes';
import { useExamStore } from '@/state/examStore';

const ReadingQuestionListStep = ({ passage, questions, onNextAction }: QuestionListProps) => {
  const setSectionScore = useExamStore((s) => s.setSectionScore);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});

  const handleAnswerChange = (questionId: number, answer: number | number[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const rawScore = questions.reduce((score, question) => {
        const correctOptionIds = question.options
          .filter((option) => option.is_correct)
          .map((option) => option.id);

        const userAnswer = answers[question.id];
        let isCorrect = false;

        if (question.type === 'single') {
          isCorrect = userAnswer === correctOptionIds[0];
        } else if (question.type === 'multiple') {
          // Ensure userAnswer is an array for multiple choice
          const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [];
          isCorrect =
            correctOptionIds.every((id) => userAnswersArray.includes(id)) &&
            userAnswersArray.length === correctOptionIds.length;
        }
        return score + (isCorrect ? 1 : 0);
      }, 0);

      const maxScore = questions.length;

      setSectionScore('reading', { rawScore, maxScore });

      onNextAction([]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <ReadingQuestionList
      passage={passage}
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      onAnswerChange={handleAnswerChange}
      onNextAction={handleNext}
      onPrevious={handlePrevious}
      answers={answers}
      showPrevious={currentQuestionIndex > 0}
    />
  );
};

export default ReadingQuestionListStep;
