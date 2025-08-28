import CompleteTask from '@/components/steps/CompleteTask';
import { NextTypes } from '@/types/commonTypes';
import { SECTION_DATA } from '@/constants/clientShellConst';
import { saveStepResult } from '@/services/api';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { normalizeScore, mapToCEFR } from '@/services/score';

export default function SpeakingCompleteStep({ onNextAction }: NextTypes) {
  const { examId, sectionScores } = useExamStore();
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleNext = async () => {
    const speakingScore = sectionScores['speaking'];
    const rawScore = speakingScore?.rawScore || 0;
    const maxScore = speakingScore?.maxScore || 0;

    const normalizedScore = normalizeScore(rawScore, maxScore);
    const cefrLevel = mapToCEFR(normalizedScore);

    if (examId && stepId) {
      try {
        const result = await saveStepResult(examId, stepId, rawScore, maxScore, cefrLevel);
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
    } else {
      // Handle the case where examId or stepId is not available
      console.error('examId or stepId not available');
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
