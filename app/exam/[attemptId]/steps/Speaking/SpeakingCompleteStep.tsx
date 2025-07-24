import SectionComplete from '@/components/steps/Final';
import { NextTypes } from '@/types/commonTypes';

export default function SpeakingCompleteStep({ onNextAction }: NextTypes) {
  const handleNext = () => {
    onNextAction();
  };

  return <SectionComplete completedSection="speaking" nextSection={null} onContinue={handleNext} />;
}
