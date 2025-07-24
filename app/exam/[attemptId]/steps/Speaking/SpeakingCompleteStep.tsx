import SectionComplete from '@/components/step/Final';

type Props = { onNextAction: () => void };

export default function SpeakingCompleteStep({ onNextAction }: Props) {
  const handleNext = () => {
    onNextAction();
  };

  return <SectionComplete completedSection="speaking" nextSection={null} onContinue={handleNext} />;
}
