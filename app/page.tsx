'use client';
import { useState, useCallback } from 'react';
import StartButton from '@/components/StartButton';
import { useUserStore } from '@/state/userStore';
import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/state/timerStore';

export default function Home() {
  const user = useUserStore((state) => state.user);
  const loadingUser = useUserStore((state) => state.loading);
  const userError = useUserStore((state) => state.error);
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();
  const startTimer = useTimerStore((state) => state.start);

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      const res = await fetch('/api/login', { method: 'POST' });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to login the exam.' }));
        console.error(errorData);
      }

      const { userData } = await res.json();
      setUser(userData);
      startTimer();
      router.push(`/exam/${userData.interceptId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setStartError(message);
    } finally {
      setIsStarting(false);
    }
  }, [router, setUser, startTimer]);

  const renderActionArea = () => {
    if (loadingUser) {
      return <div className="text-blue-700">Loading user...</div>;
    }

    if (userError) {
      return <div className="text-red-500">{userError}</div>;
    }

    if (user) {
      return (
        <div className="flex flex-col items-center gap-4">
          <StartButton handleStartAction={handleStart} />
          {isStarting && <div className="text-blue-700">Starting exam...</div>}
          {startError && <div className="text-red-500">{startError}</div>}
        </div>
      );
    }

    return null;
  };

  const FeatureCard = ({
    title,
    description,
    status,
  }: {
    title: string;
    description: string;
    status?: string;
  }) => {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 text-left border border-gray-100 hover:shadow-lg transition">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        {status && (
          <span className="inline-block mt-3 text-xs text-yellow-700 bg-yellow-100 rounded-full px-2 py-1 font-medium">
            {status}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-b from-blue-50 to-white py-10">
      <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight tracking-tight">
        Test and certify your English in&nbsp;50&nbsp;minutes.
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-xl mt-4">
        Free. Unlimited retakes. Trusted by learners, schools, and companies worldwide.
      </p>

      <div className="mt-5 mb-10 min-h-[2rem]">{renderActionArea()}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <FeatureCard
          title="📝 Timed Exam"
          description="Complete a 50-minute English proficiency test designed for accurate evaluation."
        />
        <FeatureCard
          title="🎤 Speech Recognition"
          description="Answer questions using your voice with real-time audio visualization."
          status="On Work"
        />
        <FeatureCard
          title="📊 Global Progress"
          description="Track your progress throughout the exam with a global progress bar."
        />
        <FeatureCard
          title="🔄 Multi-Step Workflow"
          description="Navigate seamlessly through different types of test questions."
        />
        <FeatureCard
          title="⚡ Instant Results"
          description="Get detailed feedback as soon as the test ends."
          status="On Work"
        />
      </div>
    </section>
  );
}
