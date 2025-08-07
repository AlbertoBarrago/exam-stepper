import CompleteTask from '@/components/steps/CompleteTask';
import { NextTypes } from '@/types/commonTypes';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/apiService';

// TODO: These props will need to be passed down from the parent component
interface SpeakingCompleteStepProps extends NextTypes {
  examId: number;
  stepId: number;
}

export default function SpeakingCompleteStep({
  onNextAction,
  examId,
  stepId,
}: SpeakingCompleteStepProps) {
  const handleNext = async () => {
    // Mocked scores for now
    const rawScore = 30; // e.g., user got 30 points
    const maxScore = 40; // e.g., max score for speaking

    try {
      const result = await saveStepResult(examId, stepId, rawScore, maxScore);
      if (result.success) {
        console.log('Successfully saved speaking step score:', result.data);
        onNextAction();
      } else {
        console.error('Failed to save speaking step score:', result.error);
        onNextAction();
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      onNextAction();
    }
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
