import { TitleAndNextActionType } from '@/types/commonTypes';
import CompleteTask from '@/components/steps/CompleteTask';
import { SECTION_DATA } from '@/constants/main';
import { saveStepResult } from '@/services/api';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { normalizeScore, mapToCEFR } from '@/services/score';

export default function ReadingCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const { examId, sectionScores } = useExamStore();
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleNext = async () => {
    const readingScore = sectionScores['reading'];
    const rawScore = readingScore?.rawScore || 0;
    const maxScore = readingScore?.maxScore || 0;

    const normalizedScore = normalizeScore(rawScore, maxScore);
    const cefrLevel = mapToCEFR(normalizedScore);

    if (examId && stepId) {
      try {
        const result = await saveStepResult(examId, stepId, rawScore, maxScore, cefrLevel);
        if (result.success) {
          console.log('Successfully saved reading step score:', result.data);
          onNextAction();
        } else {
          console.error('Failed to save reading step score:', result.error);
          onNextAction();
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        onNextAction();
      }
    } else {
      // Handle the case where examId or stepId is not available
      console.error('examId or stepId not available');
      onNextAction();
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
