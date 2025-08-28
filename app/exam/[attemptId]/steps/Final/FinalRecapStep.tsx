import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/state/timerStore';
import { useUserStore } from '@/state/userStore';
import FinalRecap from '@/components/FinalRecap';
import { useExamStore } from '@/state/examStore';
import { finalizeExam } from '@/services/api';

export default function FinalRecapStep() {
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const sectionElapsed = useTimerStore((s) => s.sectionElapsed);
  const logout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);
  const examId = useExamStore((s) => s.examId);

  const [analyzing, setAnalyzing] = useState(true);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [awardedDate, setAwardedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    pause();
    const finalize = async () => {
      if (examId === null) {
        setError('Exam ID not found. Cannot finalize exam.');
        setAnalyzing(false);
        return;
      }

      try {
        const result = await finalizeExam(examId);
        if (result.success) {
          console.log('Exam Finalization Success:', result);
          setFinalScore(result.finalScore ?? null);
          setAwardedDate(result.exam.created_at ?? null);
        } else {
          console.error('Exam Finalization Failed:', result.error);
          setError(result.error || 'Failed to finalize exam.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred during finalization.'
        );
      } finally {
        setAnalyzing(false);
      }
    };

    void finalize();
  }, [pause, examId]);

  const backToHome = useCallback(() => {
    reset();
    logout();
    router.push('/');
  }, [logout, reset, router]);

  const sectionTimes = useMemo(() => Object.entries(sectionElapsed), [sectionElapsed]);
  const totalSeconds = useMemo(
    () => sectionTimes.reduce((acc, [, v]) => acc + v, 0),
    [sectionTimes]
  );

  return (
    <FinalRecap
      sectionTimes={sectionTimes}
      totalSeconds={totalSeconds}
      analyzing={analyzing}
      finalScore={finalScore}
      error={error}
      backToHome={backToHome}
      displayName={user?.user_metadata.display_name ?? 'User'}
      awardedDate={awardedDate ?? ''}
    />
  );
}
