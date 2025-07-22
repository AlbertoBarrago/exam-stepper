'use client';
import ReadingQuestion from "@/components/step/ReadingQuestion";

type Props = {
    sentence: string,
    onNextAction: (results: boolean[]) => void;
};

 const ReadingQuestionStep = ({ sentence, onNextAction }: Props) => {

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
            sentence={sentence}
            options={["information", "knowledge", "communication", "intelligence"]}
            onNextAction={handleSubmit}
            onAnswerChangeAction={handleAnswerChange}
            initialAnswer={null}
        />
    );
}

export default ReadingQuestionStep;