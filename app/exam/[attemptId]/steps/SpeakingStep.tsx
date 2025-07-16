'use client';

import { useEffect, useRef, useState } from 'react';
import Spectrum from '@/components/Spectrum';

type Props = {
    durationMs: number;
    onNextAction: (blob: Blob) => void;
};

export default function SpeakingStep({ durationMs, onNextAction }: Props) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [recording, setRecording] = useState(false);
    const [done, setDone] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(stream);

        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];

        recorder.ondataavailable = e => chunksRef.current.push(e.data);

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            // here we can add persistence for the voice recorded
            setAudioURL(url);
            setDone(true);
        };

        recorder.start();
        recorderRef.current = recorder;
        setRecording(true);

        timerRef.current = setTimeout(() => {
            recorder.stop();
            stream.getTracks().forEach(t => t.stop());
            setRecording(false);
        }, durationMs);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (recorderRef.current?.state === 'recording') {
                recorderRef.current.stop();
            }
            stream?.getTracks().forEach(t => t.stop());
        };
    }, []);

    return (
        <div className="space-y-4">
            <p>  Parla per {
                durationMs < 60000
                    ? `${durationMs / 1000} secondi`
                    : `${durationMs / 60000} minuti`
            } di te stesso...
            </p>
            {!recording && !done && (
                <button className="btn" onClick={startRecording}>
                    Inizia a registrare
                </button>
            )}

            {recording && <p className="text-blue-600 font-semibold">🎙️ Registrazione in corso ({
                durationMs < 60000
                    ? `${durationMs / 1000} secondi`
                    : `${durationMs / 60000} minuti`
            })...</p>}

            {stream && recording && <Spectrum stream={stream} />}

            {audioURL && (
                <div className="space-y-2">
                    <p className="text-green-600">✅ Registrazione completata</p>
                    <audio controls src={audioURL} />
                    <button
                        className="btn mt-4"
                        onClick={() => onNextAction(new Blob(chunksRef.current, { type: 'audio/webm' }))}
                    >
                        Procedi
                    </button>
                </div>
            )}
        </div>
    );
}
