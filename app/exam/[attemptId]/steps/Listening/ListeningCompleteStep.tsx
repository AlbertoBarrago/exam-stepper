import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { SECTION_DATA } from '@/const/clientShellConst';

export default function ListeningCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const { steps } = useStepStore();
  const { nextStep } = useTimerStore();

  const handleNext = () => {
    const writingIntroStepIndex = steps.findIndex((step) => step.kind === 'writing-login');
    if (writingIntroStepIndex !== -1) {
      nextStep();
    } else {
      // Fallback if writing-intro steps is not found, though it should be.
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
