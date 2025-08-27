'use client';

import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/state/userStore';
import { useStepStore } from '@/state/stepStore';
import { useExamStore } from '@/state/examStore';
import { startExam } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import Link from 'next/link';

const StartExam = () => {
  const user = useUserStore((state) => state.user);
  const { steps, fetchSteps, isLoading: stepsLoading } = useStepStore();
  const setExamId = useExamStore((state) => state.setExamId);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const examStarted = useRef(false);

  useEffect(() => {
    if (steps.length === 0 && !stepsLoading) {
      void fetchSteps();
    }

    const startNewExam = async () => {
      if (user && steps.length > 0 && !stepsLoading && !examStarted.current) {
        examStarted.current = true;
        const stepIds = steps.map((step) => step.id);
        const { success, examId, error: apiError } = await startExam(user.id, stepIds);

        if (success && examId) {
          setExamId(examId);
          router.push(`/exam/${examId}`);
        } else {
          console.error('Failed to start exam:', apiError);
          setError('Failed to start the exam. Please try again later.');
        }
      }
    };

    if (user) {
      void startNewExam();
    }
  }, [user, steps, fetchSteps, stepsLoading, setExamId, router]);

  if (stepsLoading || (user && steps.length === 0 && !error)) {
    return <Loader message="Preparing your exam..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center mt-5">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p>Please log in to start an exam.</p>
          <Link href="/login">
            <a className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Go to Login
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mt-5">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center mt-5">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>No exam steps available. Please contact support.</p>
        </div>
      </div>
    );
  }

  return <Loader message="Starting your exam..." />;
};

export default StartExam;
