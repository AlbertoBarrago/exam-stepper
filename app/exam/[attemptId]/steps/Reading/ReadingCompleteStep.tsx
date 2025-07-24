import SectionComplete from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';

export default function ReadingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <SectionComplete completedSection="reading" nextSection="listening" onContinue={handleNext} />
  );
}
