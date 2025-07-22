'use client';
import { useState, useCallback } from 'react';
import StartButton from '@/components/StartButton';
import { useUserStore } from "@/state/userStore";
import { useRouter } from "next/navigation";
import { useTimerStore } from "@/state/timerStore";

export default function Home() {
    const user = useUserStore(state => state.user);
    const loadingUser = useUserStore(state => state.loading);
    const userError = useUserStore(state => state.error);
    const setUser = useUserStore(state => state.setUser);

    const router = useRouter();
    const startTimer = useTimerStore(state => state.start);

    const [isStarting, setIsStarting] = useState(false);
    const [startError, setStartError] = useState<string | null>(null);

    const handleStart = useCallback(async () => {
        setIsStarting(true);
        setStartError(null);
        try {
            const res = await fetch('/api/start', { method: 'POST' });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Failed to start the exam.' }));
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
    }, [router, setUser, startTimer]); // Dependencies for useCallback

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

    return (
        <section
            className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-b from-blue-50 to-white px-4 py-14 sm:py-14">
            <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight tracking-tight">
                Test and certify your English in&nbsp;50&nbsp;minutes.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
                Free. Unlimited retakes. Trusted by learners, schools, and companies worldwide.
            </p>

            <div className="mt-10 min-h-[5rem]">
                {renderActionArea()}
            </div>
        </section>
    );
}