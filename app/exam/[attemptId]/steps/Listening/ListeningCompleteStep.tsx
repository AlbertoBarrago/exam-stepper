import SectionComplete from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';

export default function ListeningCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <SectionComplete completedSection="listening" nextSection="writing" onContinue={handleNext} />
  );
}
