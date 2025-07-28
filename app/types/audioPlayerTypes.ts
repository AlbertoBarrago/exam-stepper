export type CircularAudioPlayerProps = {
  src: string | null;
  duration?: number;
  canPlayInfiniteTimes?: boolean;
  limitPlays?: boolean;
  showMetrics?: boolean;
  showSpectrum?: boolean;
  onPlayAction?: () => void;
  onEndedAction?: () => void;
  isRecordMode?: boolean;
  onRecordStartAction?: () => void;
  onRecordEndAction?: () => void;
  autoStopRecording?: boolean;
  stream?: MediaStream | null;
};
