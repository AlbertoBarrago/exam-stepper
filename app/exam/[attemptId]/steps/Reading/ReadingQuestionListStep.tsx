import ReadingQuestionList from '@/components/steps/ReadingTaskList';
import { useState } from 'react';
import { QuestionListProps } from '@/types/readingTypes';

const ReadingQuestionListStep = ({ passage, questions, onNextAction }: QuestionListProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId: number, answer: number | number[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('Quiz completed!', answers);
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
