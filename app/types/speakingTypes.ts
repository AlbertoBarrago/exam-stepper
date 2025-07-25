import { RefObject } from 'react';

export type SpeakingTypes = {
  onNextAction: (blob: Blob) => void;
  startRecording: () => void;
  resetAudioUrl: () => void;
  stream: MediaStream | null;
  recording: boolean;
  done: boolean;
  audioURL: string | null;
  chunksRef: RefObject<Blob[]>;
  recorderRef: RefObject<MediaRecorder | null>;
  remainingTime?: number;
};

export type SpeakingStepTypes = {
  recDurationMs?: number;
  onNextAction: (blob: Blob) => void;
};
