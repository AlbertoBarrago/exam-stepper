export type CircularAudioPlayerProps = {
  src: string | null;
  limitPlays?: boolean;
  showMetrics?: boolean;
  showSpectrum?: boolean;
  isRecordMode?: boolean;
  onPlayAction?: () => void;
  onEndedAction?: () => void;
  recordingDuration?: number;
  stream?: MediaStream | null;
  autoStopRecording?: boolean;
  onRecordEndAction?: () => void;
  onRecordStartAction?: () => void;
};
