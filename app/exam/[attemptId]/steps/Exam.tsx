'use client';
import { useEffect } from 'react';
import { useTimerStore } from '@/state/timerStore';
import PreventBackNavigation from '@/components/PreventBackNavigation';
import { useStepStore } from '@/state/stepStore';
import { useStepBody } from '@/hooks/useStepBody';
import { useParams } from 'next/navigation';
import Loader from '@/components/common/Loader';
import TimeOverMessage from '@/components/common/TimeOverMessage';

export default function Exam() {
  const { attemptId } = useParams();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const nextStep = useTimerStore((s) => s.nextStep);
  const { steps, isLoading, error, fetchSteps } = useStepStore();
  const { StepComponent } = useStepBody({
    current: currentStepIndex,
    nextAction: nextStep,
    attemptId: attemptId as string,
  });

  useEffect(() => {
    if (steps.length === 0) {
      void fetchSteps();
    }
  }, [fetchSteps, steps.length]);

  if (isLoading) {
    return <Loader message={'Loading exam steps...'} />;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <PreventBackNavigation />
      <section className="p-6 text-center">
        <StepComponent />
      </section>
      <TimeOverMessage />
    </>
  );
}
