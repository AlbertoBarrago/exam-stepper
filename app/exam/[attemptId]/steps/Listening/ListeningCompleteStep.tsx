import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/apiService';

// TODO: These props will need to be passed down from the parent component
interface ListeningCompleteStepProps extends TitleAndNextActionType {
  examId: number;
  stepId: number;
}

export default function ListeningCompleteStep({
  onNextAction,
  examId,
  stepId,
}: ListeningCompleteStepProps) {
  const { steps } = useStepStore();
  const { nextStep } = useTimerStore();

  const handleNext = async () => {
    // Mocked scores for now
    const rawScore = 18; // e.g., user got 18 questions right
    const maxScore = 20; // e.g., there were 20 questions in total

    try {
      const result = await saveStepResult(examId, stepId, rawScore, maxScore);
      if (result.success) {
        console.log('Successfully saved listening step score:', result.data);
        const writingIntroStepIndex = steps.findIndex((step) => step.kind === 'writing-login');
        if (writingIntroStepIndex !== -1) {
          nextStep();
        } else {
          onNextAction();
        }
      } else {
        console.error('Failed to save listening step score:', result.error);
        onNextAction();
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      onNextAction();
    }
  };

  return (
    <CompleteTask
      completedSection="listening"
      nextSection="writing"
      sections={SECTION_DATA}
      onContinue={handleNext}
    />
  );
}
