'use client';
import {Sentence} from "@/types/stepTypes";
import ReadingQuestion from "@/components/ReadingQuestion";

type Props = {
    sentenceList: Sentence[],
    onNextAction: (results: boolean[]) => void;
};

export default function ReadingQuestionStep({ sentenceList, onNextAction }: Props) {

    const handleAnswerChange = (optionIndex: number) => {
        console.log('Answer changed to:', optionIndex);
    };

    const handleSubmit = () => {
        onNextAction([true]);
    };

    return (
        <ReadingQuestion
            questionNumber={1}
            totalQuestions={10}
            sentence="James has considerable _____ about advertising."
            options={["information", "knowledge", "communication", "intelligence"]}
            onNextAction={handleSubmit}
            onAnswerChangeAction={handleAnswerChange}
            initialAnswer={null}
        />
    );
}