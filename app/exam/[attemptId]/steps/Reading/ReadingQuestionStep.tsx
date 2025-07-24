'use client';
import ReadingQuestion from "@/components/step/ReadingQuestion";
import {IdValue} from "@/types/stepTypes";

type Props = {
    sentence: string,
    options: IdValue[]
    onNextAction: (results: boolean[]) => void;
};

 const ReadingQuestionStep = ({ sentence, options, onNextAction }: Props) => {

    const handleAnswerChange = (optionIndex: number) => {
        console.log('Answer changed to:', optionIndex);
    };
    const handleSubmit = (optionsSelected: number) => {
        console.log('Submitting with options:', optionsSelected);
        onNextAction([true]);
    };

    return (
        <ReadingQuestion
            questionNumber={1}
            totalQuestions={10}
            sentence={sentence}
            options={options}
            onNextAction={handleSubmit}
            onAnswerChangeAction={handleAnswerChange}
            initialAnswer={null}
        />
    );
}

export default ReadingQuestionStep;