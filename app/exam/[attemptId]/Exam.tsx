'use client';
import { JSX, useEffect } from 'react';
import { useTimerStore } from '@/state/timerStore';
import PreventBackNavigation from '@/components/PreventBackNavigation';
import { useStepStore } from '@/state/stepStore';
import { useStepBody } from '@/hooks/useStepBody';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/state/userStore';
import { startExam } from '@/services/apiService';
import { useExamStore } from '@/state/examStore';

export default function Exam(): JSX.Element | null {
  const { attemptId } = useParams();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const nextStep = useTimerStore((s) => s.nextStep);
  const { steps, isLoading, error, fetchSteps } = useStepStore();
  const user = useUserStore((s) => s.user);
  const setExamId = useExamStore((s) => s.setExamId);
  const router = useRouter();
  const { StepComponent } = useStepBody({
    current: currentStepIndex,
    nextAction: nextStep,
    attemptId: attemptId as string,
  });

  useEffect(() => {
    const initializeExam = async () => {
      if (steps.length === 0) {
        await fetchSteps();
      }

      if (user && steps.length > 0) {
        const stepIds = steps.map((step) => step.id);
        const result = await startExam(user.id, stepIds);
        if (result.success && result.examId) {
          console.log('Exam started successfully:', result.examId);
          setExamId(result.examId);
        } else {
          console.error('Failed to start exam:', result.error);
        }
      }
    };

    void initializeExam();
  }, [fetchSteps, steps.length, user, setExamId, steps]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

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
