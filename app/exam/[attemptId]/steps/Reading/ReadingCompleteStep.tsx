'use client';

import SectionComplete from '@/components/step/Final';

type Props = { title: string; onNextAction: () => void };

export default function ReadingCompleteStep({ onNextAction }: Props) {
  const handleNext = () => {
    onNextAction();
  };

  return (
    <SectionComplete completedSection="reading" nextSection="listening" onContinue={handleNext} />
  );
}
