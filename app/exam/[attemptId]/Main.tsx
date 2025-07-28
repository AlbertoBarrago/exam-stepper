'use client';
import { JSX, useEffect } from 'react';
import { useTimerStore } from '@/state/timerStore';
import PreventBackNavigation from '@/components/PreventBackNavigation';
import { useStepStore } from '@/state/stepStore';
import { useStepBody } from '@/hooks/useStepBody';

export default function Main(): JSX.Element {
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const nextStep = useTimerStore((s) => s.nextStep);
  const { steps, isLoading, error, fetchSteps } = useStepStore();
  const { StepComponent } = useStepBody({ current: currentStepIndex, next: nextStep });

  useEffect(() => {
    if (steps.length === 0) {
      void fetchSteps();
    }
  }, [fetchSteps, steps.length]);

  if (isLoading) {
    return <div className="text-center p-10">Loading Exam...</div>;
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
    </>
  );
}
