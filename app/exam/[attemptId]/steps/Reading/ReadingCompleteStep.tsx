import { TitleAndNextActionType } from '@/types/commonTypes';
import CompleteTask from '@/components/steps/CompleteTask';
import { SECTION_DATA } from '@/constants/clientShellConst';

export default function ReadingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <CompleteTask
      completedSection="reading"
      nextSection="listening"
      sections={SECTION_DATA}
      onContinue={handleNext}
    />
  );
}
