'use client';
import ReadingPassage from "@/components/step/ReadingQuestionList";
import { Question } from "@/types/stepTypes";
import {useState} from "react";

type Props = {
    questions: Question[],
    passage: string,
    onNextAction: (results: boolean[]) => void;
};

const ReadingQuestionList = ({passage, questions, onNextAction} : Props) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleAnswerChange = (questionId: number, answer: number | number[]) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer
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
        <ReadingPassage
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

export default ReadingQuestionList;