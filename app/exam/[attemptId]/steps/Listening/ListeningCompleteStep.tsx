import CompleteTask from '@/components/steps/CompleteTask';
import { TitleAndNextActionType } from '@/types/commonTypes';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/api';
import { useExamStore } from '@/state/examStore';
import { normalizeScore, mapToCEFR } from '@/services/score';

export default function ListeningCompleteStep({ onNextAction }: TitleAndNextActionType) {
  const { examId, sectionScores } = useExamStore();
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;
  const { nextStep } = useTimerStore();

  const handleNext = async () => {
    const listeningScore = sectionScores['listening'];
    const rawScore = listeningScore?.rawScore || 0;
    const maxScore = listeningScore?.maxScore || 0;

    const normalizedScore = normalizeScore(rawScore, maxScore);
    const cefrLevel = mapToCEFR(normalizedScore);

    if (examId && stepId) {
      try {
        const result = await saveStepResult(examId, stepId, rawScore, maxScore, cefrLevel);
        if (result.success) {
          console.log('Successfully saved listening step score:', result.data);
          const writingIntroStepIndex = steps.findIndex((step) => step.kind === 'writing-login');
          if (writingIntroStepIndex !== -1) {
            nextStep();
          } else {
            onNextAction();
          }
        } else {
          console.error('Failed to save listening step score:', result.error);
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
      completedSection="listening"
      nextSection="writing"
      sections={SECTION_DATA}
      onContinue={handleNext}
    />
  );
}
