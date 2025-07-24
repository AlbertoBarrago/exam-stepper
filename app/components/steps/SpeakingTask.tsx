import Spectrum from '@/components/Spectrum';
import { SpeakingTypes } from '@/types/speakingTypes';

const SpeakingTask = ({
  durationMs,
  onNextAction,
  done,
  recording,
  stream,
  audioURL,
  startRecording,
  chunksRef,
}: SpeakingTypes) => {
  return (
    <>
      <div className="space-y-4">
        <p>
          {' '}
          Talk about yourself in{' '}
          {durationMs < 60000 ? `${durationMs / 1000} seconds` : `${durationMs / 60000} minutes`}...
        </p>
        {!recording && !done && (
          <button className="btn" onClick={startRecording}>
            Start to record
          </button>
        )}

        {recording && (
          <p className="text-blue-600 font-semibold">
            🎙️ Record in progress...{' '}
            {durationMs < 60000 ? `${durationMs / 1000} seconds` : `${durationMs / 60000} minutes`}
          </p>
        )}

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
    </>
  );
};

export default SpeakingTask;
