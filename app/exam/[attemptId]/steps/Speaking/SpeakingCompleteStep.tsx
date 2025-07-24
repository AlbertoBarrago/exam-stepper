import CompleteTask from '@/components/steps/CompleteTask';
import { NextTypes } from '@/types/commonTypes';
import { SECTION_DATA } from '@/const/clientShellConst';

export default function SpeakingCompleteStep({ onNextAction }: NextTypes) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <CompleteTask
      completedSection="speaking"
      sections={SECTION_DATA}
      nextSection={null}
      onContinue={handleNext}
    />
  );
}
