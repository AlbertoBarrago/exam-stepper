import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/api';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';

export default function WritingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const { examId, sectionScores } = useExamStore();
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleNext = async () => {
    const writingScore = sectionScores['writing'];
    const rawScore = writingScore?.rawScore || 0;
    const maxScore = writingScore?.maxScore || 0;

    if (examId && stepId) {
      try {
        const result = await saveStepResult(examId, stepId, rawScore, maxScore);
        if (result.success) {
          console.log('Successfully saved writing step score:', result.data);
          onNextAction();
        } else {
          console.error('Failed to save writing step score:', result.error);
          onNextAction();
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        onNextAction();
      }
    } else {
      // Handle the case where examId or stepId is not available
      console.error('examId or stepId not available');
      onNextAction();
    }
  };

  return (
    <CompleteTask
      completedSection="writing"
      sections={SECTION_DATA}
      nextSection="speaking"
      onContinue={handleNext}
    />
  );
}
