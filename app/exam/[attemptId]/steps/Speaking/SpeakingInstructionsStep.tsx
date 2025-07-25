import { useEffect, useRef, useState, useCallback } from 'react';
import SpeakingTask from '@/components/steps/SpeakingTask';
import { SpeakingStepTypes } from '@/types/speakingTypes';

export default function SpeakingInstructionsStep({
  recDurationMs,
  onNextAction,
  audioFileUrl,
}: SpeakingStepTypes) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(recDurationMs! / 1000);
  const [audioFinished, setAudioFinished] = useState(false);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setRecording(false);
  }, []);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);

      const recorder = new MediaRecorder(mediaStream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          setDone(true);
        }
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start(100);
      recorderRef.current = recorder;
      setRecording(true);

      // Set the timer to stop recording after recDurationMs
      timerRef.current = setTimeout(stopRecording, recDurationMs);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const resetAudioUrl = () => {
    setAudioURL(null);
    setDone(false);
    setRemainingTime(recDurationMs! / 1000);
  };

  const handleAudioEnd = () => {
    setAudioFinished(true);
  };

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime! <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime! - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [recording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, []);

  return (
    <SpeakingTask
      audioFileUrl={audioFileUrl}
      remainingTime={remainingTime}
      startRecording={startRecording}
      resetAudioUrl={resetAudioUrl}
      onNextAction={onNextAction}
      handleAudioEnd={handleAudioEnd}
      audioFinished={audioFinished}
      recording={recording}
      done={done}
      recorderRef={recorderRef}
      chunksRef={chunksRef}
      audioURL={audioURL}
      stream={stream}
    />
  );
}
