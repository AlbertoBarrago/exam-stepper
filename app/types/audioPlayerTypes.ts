type AudioRecordingOptions = {
  enabled: boolean;
  autoStop?: boolean;
  duration?: number;
  onEnd: () => void;
  onStart: () => void;
};

export type CircularAudioPlayerProps = {
  src: string | null;
  limitPlays?: boolean;
  showMetrics?: boolean;
  showSpectrum?: boolean;
  onPlayAction?: () => void;
  onEndAction?: () => void;
  stream?: MediaStream | null;
  recordingOptions?: AudioRecordingOptions;
};
