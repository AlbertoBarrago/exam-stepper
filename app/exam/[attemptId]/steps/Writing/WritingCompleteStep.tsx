import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/apiService';

// TODO: These props will need to be passed down from the parent component
interface WritingCompleteStepProps extends TitleAndNextActionType {
  examId: number;
  stepId: number;
}

export default function WritingCompleteStep({
  onNextAction,
  examId,
  stepId,
}: WritingCompleteStepProps) {
  const handleNext = async () => {
    // Mocked scores for now
    const rawScore = 15; // e.g., user got 15 points
    const maxScore = 20; // e.g., max score for writing

    try {
      const result = await saveStepResult(examId, stepId, rawScore, maxScore);
      if (result.success) {
        console.log('Successfully saved writing step score:', result.data);
        onNextAction(); // Proceed to the next step
      } else {
        console.error('Failed to save writing step score:', result.error);
        onNextAction(); // Still allow navigation
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      onNextAction(); // Ensure the user can still proceed
    }
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
