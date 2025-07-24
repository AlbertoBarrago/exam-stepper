import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { SECTION_DATA } from '@/const/clientShellConst';

export default function WritingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
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
