'use client';
import { useRef, useEffect } from 'react';
import {useTimer} from "@/components/UseTimer";

export default function AudioStep({ audioUrl, durationMs, onNext }:
                                  { audioUrl: string; durationMs: number; onNext: () => void }) {

    const audioRef = useRef<HTMLAudioElement>(null);
    const remaining = useTimer(durationMs, onNext);

    useEffect(() => { audioRef.current?.play(); }, []);

    return (
        <div>
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            <p className="mt-4">Time left: {(remaining / 1000).toFixed(0)} s</p>
        </div>
    );
}
