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
            //TODO: Add here the logic for analyze text with an ai and return a score, add persistence on DB and implement the Audit flux
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
            <p>  Talk about yourself in  {
                durationMs < 60000
                    ? `${durationMs / 1000} seconds`
                    : `${durationMs / 60000} minutes`
            }...
            </p>
            {!recording && !done && (
                <button className="btn" onClick={startRecording}>
                    Start to record
                </button>
            )}

            {recording && <p className="text-blue-600 font-semibold">🎙️ Record in progress... {
                durationMs < 60000
                    ? `${durationMs / 1000} seconds`
                    : `${durationMs / 60000} minutes`
            }</p>}

            {stream && recording && <Spectrum stream={stream} />}

            {audioURL && (
                <div className="space-y-2 flex flex-col items-center gap-4">
                    <p className="text-green-600">✅ Record completed</p>
                    <audio controls src={audioURL} />
                    <button
                        className="btn mt-4"
                        onClick={() => onNextAction(new Blob(chunksRef.current, { type: 'audio/webm' }))}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
