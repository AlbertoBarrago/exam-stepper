import { useEffect, useRef, useState } from 'react';
import SpeakingTask from '@/components/step/SpeakingTask';
import { SpeakingStepTypes } from '@/types/speakingTypes';

export default function SpeakingStep({ durationMs, onNextAction }: SpeakingStepTypes) {
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

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

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
      stream.getTracks().forEach((t) => t.stop());
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
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <SpeakingTask
      durationMs={durationMs}
      startRecording={startRecording}
      onNextAction={onNextAction}
      recording={recording}
      done={done}
      recorderRef={recorderRef}
      chunksRef={chunksRef}
      audioURL={audioURL}
      stream={stream}
    />
  );
}
