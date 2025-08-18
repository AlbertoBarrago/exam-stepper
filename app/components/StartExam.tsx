'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/state/userStore';
import { useStepStore } from '@/state/stepStore';
import { useExamStore } from '@/state/examStore';
import { startExam } from '@/services/apiService';
import { useRouter } from 'next/navigation';

const StartExam = () => {
  const user = useUserStore((state) => state.user);
  const { steps, fetchSteps, isLoading: stepsLoading } = useStepStore();
  const setExamId = useExamStore((state) => state.setExamId);
  const router = useRouter();

  useEffect(() => {
    if (steps.length === 0 && !stepsLoading) {
      void fetchSteps();
    }

    const startNewExam = async () => {
      if (user && steps.length > 0 && !stepsLoading) {
        const stepIds = steps.map((step) => step.id);
        const { success, examId, error } = await startExam(user.id, stepIds);

        if (success && examId) {
          setExamId(examId);
          router.push(`/exam/${examId}`);
        } else {
          console.error('Failed to start exam:', error);
        }
      }
    };

    void startNewExam();
  }, [user, steps, fetchSteps, stepsLoading, setExamId, router]);

  if (stepsLoading) {
    return <div>Loading exam steps...</div>;
  }

  if (!user) {
    return <div>Please log in to start an exam.</div>;
  }

  if (steps.length === 0) {
    return <div>No exam steps available. Please contact support.</div>;
  }

  return <div>Starting exam...</div>;
};

export default StartExam;
