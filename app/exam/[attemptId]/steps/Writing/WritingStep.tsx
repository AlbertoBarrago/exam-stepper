import WritingTask from '@/components/steps/WritingTask';
import { WritingTypes } from '@/types/writingTypes';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { saveStepResult } from '@/services/apiService';

export default function WritingStep({ onNextAction }: WritingTypes) {
  const examId = useExamStore((s) => s.examId);
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleTextChange = (text: string, wordCount: number) => {
    console.log('Text changed:', { text, wordCount });
  };

  const submitToAi = async () => {
    if (examId && stepId) {
      await saveStepResult(examId, stepId, 0, 0);
    }
    onNextAction();
  };

  return (
    <WritingTask
      title="Write a clear and compelling job advertisement."
      placeholder="Start your answer here..."
      minWords={50}
      maxWords={150}
      onTextChange={handleTextChange}
      onSubmit={submitToAi}
      buttonText="Submit"
    />
  );
}
