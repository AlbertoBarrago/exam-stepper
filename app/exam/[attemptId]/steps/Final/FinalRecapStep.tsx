import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/state/timerStore';
import { useUserStore } from '@/state/userStore';
import FinalRecap from '@/components/FinalRecap';

export default function FinalRecapStep() {
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const sectionElapsed = useTimerStore((s) => s.sectionElapsed);
  const logout = useUserStore((s) => s.logout);

  const [analyzing, setAnalyzing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    pause();
    const timer = setTimeout(() => setAnalyzing(false), 3000);
    return () => clearTimeout(timer);
  }, [pause]);

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
      backToHome={backToHome}
    />
  );
}
