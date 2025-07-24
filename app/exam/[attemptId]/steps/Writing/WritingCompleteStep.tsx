import SectionComplete from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';

export default function WritingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <SectionComplete completedSection="writing" nextSection="speaking" onContinue={handleNext} />
  );
}
