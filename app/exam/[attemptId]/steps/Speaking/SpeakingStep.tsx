import { useEffect, useRef, useState, useCallback } from 'react';
import SpeakingTask from '@/components/steps/SpeakingTask';
import { SpeakingStepTypes } from '@/types/speakingTypes';
import { saveStepResult } from '@/services/api';
import { useExamStore } from '@/state/examStore';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';
import { DURATION_INTRODUCTION_MS } from '@/constants/stepConst';

export default function SpeakingStep({
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

      timerRef.current = setTimeout(stopRecording, recDurationMs);
    } catch (err) {
      console.error('Failed to login recording:', err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const examId = useExamStore((s) => s.examId);
  const setSectionScore = useExamStore((s) => s.setSectionScore);
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;

  const handleNextActionWithAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.webm');

      const response = await fetch('/api/exam/speaking-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawScore = data.score;
      const maxScore = data.maxScore;
      const detailedDescription = data.detailedDescription;

      setSectionScore('speaking', { rawScore, maxScore });

      if (examId && stepId) {
        await saveStepResult(examId, stepId, rawScore, maxScore);
      }

      console.log('AI Detailed Description (Speaking):', detailedDescription);

      // Call the original onNextAction to proceed to the next step
      onNextAction(rawScore);
    } catch (error) {
      console.error('Error submitting audio for AI analysis:', error);
      alert('Failed to analyze audio. Please try again.');
    }
  };

  return (
    <SpeakingTask
      audioFileUrl={audioFileUrl}
      remainingTime={remainingTime}
      startRecording={startRecording}
      resetAudioUrl={resetAudioUrl}
      onNextAction={handleNextActionWithAudio}
      handleAudioEnd={handleAudioEnd}
      audioFinished={audioFinished}
      recording={recording}
      done={done}
      durationMs={DURATION_INTRODUCTION_MS}
      mode={'recording'}
      stopEndRecording={stopRecording}
      recorderRef={recorderRef}
      chunksRef={chunksRef}
      audioURL={audioURL}
      stream={stream}
    />
  );
}
