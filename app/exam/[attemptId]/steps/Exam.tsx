'use client';
import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/state/timerStore';
import PreventBackNavigation from '@/components/PreventBackNavigation';
import { useStepStore } from '@/state/stepStore';
import { useStepBody } from '@/hooks/useStepBody';
import { useParams } from 'next/navigation';
import Loader from '@/components/common/Loader';
import TimeOverMessage from '@/components/common/TimeOverMessage';
import { updateStepResult } from '@/services/apiService';

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

  const stepStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (steps.length === 0) {
      void fetchSteps();
    }
  }, [fetchSteps, steps.length]);

  useEffect(() => {
    const step = steps[currentStepIndex];
    if (!step) return;

    const previousStep = steps[currentStepIndex - 1];

    if (previousStep && stepStartTimeRef.current) {
      const timeSpentMs = Date.now() - stepStartTimeRef.current;
      void updateStepResult({
        exam_id: attemptId as string,
        step_id: previousStep.id,
        time_spent_ms: timeSpentMs,
        visited: true,
      });
    }
  }, [currentStepIndex, steps, attemptId]);

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
