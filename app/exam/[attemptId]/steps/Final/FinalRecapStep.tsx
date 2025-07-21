'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useTimerStore } from '@/state/timerStore';
import {useUserStore} from "@/state/userStore";

function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function FinalRecapStep() {
    const pause = useTimerStore(s => s.pause);
    const reset = useTimerStore(s => s.reset);
    const sectionElapsed = useTimerStore(s => s.sectionElapsed);
    const logout = useUserStore(s=> s.logout)

    const [analyzing, setAnalyzing] = useState(true);
    const router = useRouter();

    useEffect(() => {
        pause();
        const timer = setTimeout(() => setAnalyzing(false), 4000);
        return () => clearTimeout(timer);
    }, [pause]);

    const backToHome = () => {
        reset()
        logout()
        router.push('/');
    };

    const sectionTimes = Object.entries(sectionElapsed);
    const totalSeconds = sectionTimes.reduce((acc, [, v]) => acc + v, 0);

    return (
        <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Test Complete!</h2>
            <p className="font-medium">Time spent in each section:</p>
            <div className="flex flex-col items-center gap-2 mb-2">
                {sectionTimes.map(([section, secs]) => (
                    <span key={section}>
                        <span className="capitalize font-semibold">{section}</span>: {formatTime(secs)}
                    </span>
                ))}
            </div>
            <div className="font-bold text-lg">
                Total time: {formatTime(totalSeconds)}
            </div>
            {analyzing ? (
                <>
                    <p className="text-blue-600">Analyzing results...</p>
                    <div className="loader mx-auto mt-4"/>
                </>
            ) : (
                <>
                    <p className="text-green-600">Your results will be available shortly.</p>
                    <button className="btn mt-4" onClick={backToHome}>Back to Home</button>
                </>
            )}
        </div>
    );
}