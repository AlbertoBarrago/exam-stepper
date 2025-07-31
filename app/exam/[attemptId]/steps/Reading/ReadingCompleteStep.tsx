import { TitleAndNextActionType } from '@/types/commonTypes';
import CompleteTask from '@/components/steps/CompleteTask';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/apiService';

// TODO: These props will need to be passed down from the parent component
interface ReadingCompleteStepProps extends TitleAndNextActionType {
  examId: number;
  stepId: number;
}

export default function ReadingCompleteStep({ onNextAction, examId, stepId }: ReadingCompleteStepProps) {
  const handleNext = async () => {
    // Mocked scores for now
    const rawScore = 16; // e.g., user got 16 questions right
    const maxScore = 20; // e.g., there were 20 questions in total

    try {
      const result = await saveStepResult(examId, stepId, rawScore, maxScore);
      if (result.success) {
        console.log('Successfully saved reading step score:', result.data);
        onNextAction(); // Proceed to the next step
      } else {
        // Handle the error case - maybe show a message to the user
        console.error('Failed to save reading step score:', result.error);
        // Optionally, still allow navigation or show an error message
        onNextAction();
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      onNextAction(); // Ensure the user can still proceed
    }
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
