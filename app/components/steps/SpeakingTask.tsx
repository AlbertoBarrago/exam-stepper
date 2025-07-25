import Spectrum from '@/components/Spectrum';
import { SpeakingTypes } from '@/types/speakingTypes';
import AudioPlayer from '@/components/AudioPlayer';
import { useEffect, useState } from 'react';

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
  const [remainingTime, setRemainingTime] = useState(durationMs / 1000);

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [recording]);

  return (
    <>
      <div className="space-y-4 flex flex-col items-center mt-10">
        <p>
          {' '}
          Talk about yourself in{' '}
          {durationMs < 60000 ? `${durationMs / 1000} seconds` : `${durationMs / 60000} minutes`}...
        </p>
        {!recording && !done && (
          <>
            <div className="flex flex-col items-center gap-4">
              <AudioPlayer src={null} onPlay={startRecording} permissionStep={true} />
              <p className="text-gray-500">Start to record</p>
            </div>
          </>
        )}

        {stream && recording && <Spectrum stream={stream} />}

        {recording && (
          <p className="text-blue-600 font-semibold">
            🎙️ Record in progress, {remainingTime} seconds...{' '}
          </p>
        )}

        {audioURL && (
          <div className="space-y-2 flex flex-col items-center gap-4">
            <AudioPlayer src={audioURL} showSpectrum={true} permissionStep={true} />
            <p className="text-green-600">✅ Record completed</p>
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
