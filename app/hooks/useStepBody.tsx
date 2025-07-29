'use client';
import WelcomeStep from '@/exam/[attemptId]/steps/Welcome/WelcomeStep';
import ReadingIntroStep from '@/exam/[attemptId]/steps/Reading/ReadingIntroStep';
import ReadingQuestionStep from '@/exam/[attemptId]/steps/Reading/ReadingQuestionStep';
import ReadingCompleteStep from '@/exam/[attemptId]/steps/Reading/ReadingCompleteStep';
import ListeningIntroStep from '@/exam/[attemptId]/steps/Listening/ListeningIntroStep';
import ListeningStep from '@/exam/[attemptId]/steps/Listening/ListeningStep';
import ListeningCompleteStep from '@/exam/[attemptId]/steps/Listening/ListeningCompleteStep';
import WritingIntroStep from '@/exam/[attemptId]/steps/Writing/WritingIntroStep';
import WritingStep from '@/exam/[attemptId]/steps/Writing/WritingStep';
import WritingCompleteStep from '@/exam/[attemptId]/steps/Writing/WritingCompleteStep';
import SpeakingIntroStep from '@/exam/[attemptId]/steps/Speaking/SpeakingIntroStep';
import SpeakingInstructionsStep from '@/exam/[attemptId]/steps/Speaking/SpeakingInstructionsStep';
import FinalRecapStep from '@/exam/[attemptId]/steps/Final/FinalRecapStep';
import PermissionStep from '@/exam/[attemptId]/steps/Permission/PermissionStep';
import SpeakingCompleteStep from '@/exam/[attemptId]/steps/Speaking/SpeakingCompleteStep';
import { useStepStore } from '@/state/stepStore';
import ReadingQuestionListStep from '@/exam/[attemptId]/steps/Reading/ReadingQuestionListStep';
import { DURATION_INTRODUCTION_MS } from '@/const/stepConst';

export function useStepBody({ current, next }: { current: number; next: () => void }) {
  const steps = useStepStore((s) => s.steps);
  const step = steps[current];

  if (!step) {
    return { StepComponent: () => <div>Loading step...</div> };
  }

  switch (step.kind) {
    case 'welcome':
      return { StepComponent: () => <WelcomeStep onNextAction={next} /> };
    case 'permission':
      return { StepComponent: () => <PermissionStep onNextAction={next} /> };
    case 'reading-start':
      return {
        StepComponent: () => (
          <ReadingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={next}
          />
        ),
      };
    case 'reading-question':
      return {
        StepComponent: () => (
          <ReadingQuestionStep
            sentence={step.sentence}
            options={step.options}
            onNextAction={next}
          />
        ),
      };
    case 'reading-question-list':
      return {
        StepComponent: () => (
          <ReadingQuestionListStep
            questions={step.questions}
            passage={step.passage}
            onNextAction={next}
          />
        ),
      };
    case 'reading-complete':
      return {
        StepComponent: () => <ReadingCompleteStep title={step.title} onNextAction={next} />,
      };
    case 'listening-start':
      return {
        StepComponent: () => (
          <ListeningIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={next}
          />
        ),
      };
    case 'listening-question':
      return {
        StepComponent: () => (
          <ListeningStep audioUrl={step.audioUrl} questions={step.questions} onNextAction={next} />
        ),
      };
    case 'listening-complete':
      return {
        StepComponent: () => <ListeningCompleteStep title={step.title} onNextAction={next} />,
      };
    case 'writing-start':
      return {
        StepComponent: () => (
          <WritingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            kind={step.kind}
            durationMs={step.durationMs}
            onNextAction={next}
          />
        ),
      };
    case 'writing-question':
      return { StepComponent: () => <WritingStep title={step.title} onNextAction={next} /> };
    case 'writing-complete':
      return {
        StepComponent: () => <WritingCompleteStep title={step.title} onNextAction={next} />,
      };
    case 'speaking-start':
      return {
        StepComponent: () => (
          <SpeakingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={next}
          />
        ),
      };
    case 'speaking-question':
      return {
        StepComponent: () => (
          <SpeakingInstructionsStep
            recDurationMs={DURATION_INTRODUCTION_MS}
            audioFileUrl={step.audioUrl}
            onNextAction={next}
          />
        ),
      };
    case 'speaking-complete':
      return { StepComponent: () => <SpeakingCompleteStep onNextAction={next} /> };
    case 'final':
      return { StepComponent: () => <FinalRecapStep /> };
    default:
      return { StepComponent: () => <div>Invalid step</div> };
  }
}
