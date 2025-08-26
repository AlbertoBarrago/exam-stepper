'use client';

import { useStepStore } from '@/state/stepStore';
import { DURATION_INTRODUCTION_MS, StepKind } from '@/constants/stepConst';
import { useExamStore } from '@/state/examStore';

import Welcome from '@/exam/[attemptId]/steps/Welcome/Welcome';
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
import ReadingQuestionListStep from '@/exam/[attemptId]/steps/Reading/ReadingQuestionListStep';

export function useStepBody({
  current,
  nextAction,
}: {
  current: number;
  nextAction: () => void;
  attemptId: string;
}) {
  const steps = useStepStore((s) => s.steps);
  const examId = useExamStore((s) => s.examId);
  const step = steps[current];

  if (!step) {
    return { StepComponent: () => <div>Loading step...</div> };
  }

  switch (step.kind) {
    case StepKind.Welcome:
      return { StepComponent: () => <Welcome onNextAction={nextAction} /> };
    case StepKind.Permission:
      return { StepComponent: () => <PermissionStep onNextAction={nextAction} /> };
    case StepKind.ReadingLogin:
      return {
        StepComponent: () => (
          <ReadingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.ReadingQuestion:
      return {
        StepComponent: () => (
          <ReadingQuestionStep
            sentence={step.sentence}
            options={step.options}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.ReadingQuestionList:
      return {
        StepComponent: () => (
          <ReadingQuestionListStep
            questions={step.questions}
            passage={step.passage}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.ReadingComplete:
      if (examId === null) {
        return { StepComponent: () => <div>Error: Exam ID not available.</div> };
      }
      return {
        StepComponent: () => <ReadingCompleteStep title={step.title} onNextAction={nextAction} />,
      };
    case StepKind.ListeningLogin:
      return {
        StepComponent: () => (
          <ListeningIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.ListeningQuestion:
      return {
        StepComponent: () => (
          <ListeningStep
            audioUrl={step.audioUrl}
            questions={step.questions}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.ListeningComplete:
      if (examId === null) {
        return { StepComponent: () => <div>Error: Exam ID not available.</div> };
      }
      return {
        StepComponent: () => <ListeningCompleteStep title={step.title} onNextAction={nextAction} />,
      };
    case StepKind.WritingLogin:
      return {
        StepComponent: () => (
          <WritingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            kind={step.kind}
            durationMs={step.durationMs}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.WritingQuestion:
      return { StepComponent: () => <WritingStep title={step.title} onNextAction={nextAction} /> };
    case StepKind.WritingComplete:
      if (examId === null) {
        return { StepComponent: () => <div>Error: Exam ID not available.</div> };
      }
      return {
        StepComponent: () => <WritingCompleteStep title={step.title} onNextAction={nextAction} />,
      };
    case StepKind.SpeakingLogin:
      return {
        StepComponent: () => (
          <SpeakingIntroStep
            title={step.title}
            subtitle={step.subTitle}
            durationMs={step.durationMs}
            kind={step.kind}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.SpeakingQuestion:
      return {
        StepComponent: () => (
          <SpeakingInstructionsStep
            recDurationMs={DURATION_INTRODUCTION_MS}
            audioFileUrl={step.audioUrl}
            onNextAction={nextAction}
          />
        ),
      };
    case StepKind.SpeakingComplete:
      if (examId === null) {
        return { StepComponent: () => <div>Error: Exam ID not available.</div> };
      }
      return {
        StepComponent: () => <SpeakingCompleteStep onNextAction={nextAction} />,
      };
    case StepKind.Final:
      return { StepComponent: () => <FinalRecapStep /> };
    default:
      return { StepComponent: () => <div>Invalid step</div> };
  }
}
