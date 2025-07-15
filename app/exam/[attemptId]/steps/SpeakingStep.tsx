'use client';
import { useEffect, useRef, useState } from 'react';
import Spectrum from '@/components/Spectrum';
import {useTimer} from "@/components/UseTimer";

export default function SpeakingStep({ durationMs, onNext }:
                                     { durationMs: number; onNext: (blob: Blob) => void }) {

    const [stream, setStream] = useState<MediaStream | null>(null);
    // @ts-ignore
    const recorder = useRef<MediaRecorder>();
    const chunks = useRef<Blob[]>([]);
    const remaining = useTimer(durationMs, () => {
        recorder.current?.stop();
    });

    // start mic
    useEffect(() => {
        (async () => {
            const s = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(s);
            recorder.current = new MediaRecorder(s);
            recorder.current.ondataavailable = e => chunks.current.push(e.data);
            recorder.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'audio/webm' });
                onNext(blob);
            };
            recorder.current.start();
        })();
    }, [onNext]);

    return (
        <div>
            <Spectrum stream={stream} />
            <p className="mt-2">Speak now… Time left: {(remaining / 1000).toFixed(0)} s</p>
        </div>
    );
}