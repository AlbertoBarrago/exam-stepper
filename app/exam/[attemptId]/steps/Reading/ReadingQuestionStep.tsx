import ReadingTask from '@/components/steps/ReadingTask';
import { IdValue } from '@/types/stepTypes';
import { useExamStore } from '@/state/examStore';

type Props = {
  sentence: string;
  options: IdValue[];
  onNextAction: (results: boolean[]) => void;
};

const ReadingQuestionStep = ({ sentence, options, onNextAction }: Props) => {
  const setSectionScore = useExamStore((s) => s.setSectionScore);

  const handleAnswerChange = (optionIndex: number) => {
    console.log('Answer changed to:', optionIndex);
  };
  const handleSubmit = async (optionSelectedId: number) => {
    const selectedOption = options.find((option) => option.id === optionSelectedId);
    const isCorrect = selectedOption?.is_correct || false;
    const rawScore = isCorrect ? 1 : 0;
    const maxScore = 1;

    setSectionScore('reading', { rawScore, maxScore });

    onNextAction([isCorrect]);
  };

  return (
    <ReadingTask
      questionNumber={1}
      totalQuestions={10}
      sentence={sentence}
      options={options}
      onNextAction={handleSubmit}
      onAnswerChangeAction={handleAnswerChange}
      initialAnswer={null}
    />
  );
};

export default ReadingQuestionStep;
