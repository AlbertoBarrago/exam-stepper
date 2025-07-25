import { RefObject } from 'react';

export type SpeakingTypes = {
  onNextAction: (blob: Blob) => void;
  startRecording: () => void;
  resetAudioUrl: () => void;
  stream: MediaStream | null;
  recording: boolean;
  done: boolean;
  audioURL: string | null;
  audioFileUrl: string;
  chunksRef: RefObject<Blob[]>;
  recorderRef: RefObject<MediaRecorder | null>;
  remainingTime?: number;
  audioFinished: boolean;
  handleAudioEnd: () => void;
};

export type SpeakingStepTypes = {
  recDurationMs?: number;
  audioFileUrl: string;
  onNextAction: (blob: Blob) => void;
};
