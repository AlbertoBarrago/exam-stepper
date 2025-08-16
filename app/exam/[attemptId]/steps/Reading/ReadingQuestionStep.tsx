import ReadingTask from '@/components/steps/ReadingTask';
import { IdValue } from '@/types/stepTypes';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { saveStepResult } from '@/services/apiService';

type Props = {
  sentence: string;
  options: IdValue[];
  correctOption: number;
  onNextAction: (results: boolean[]) => void;
};

const ReadingQuestionStep = ({ sentence, options, correctOption, onNextAction }: Props) => {
  const examId = useExamStore((s) => s.examId);
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleAnswerChange = (optionIndex: number) => {
    console.log('Answer changed to:', optionIndex);
  };
  const handleSubmit = async (optionSelected: number) => {
    const isCorrect = optionSelected === correctOption;
    const rawScore = isCorrect ? 1 : 0;
    const maxScore = 1;

    if (examId && stepId) {
      await saveStepResult(examId, stepId, rawScore, maxScore);
    }

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
