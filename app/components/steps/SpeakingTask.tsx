import Spectrum from '@/components/Spectrum';
import { SpeakingTypes } from '@/types/speakingTypes';
import AudioPlayer from '@/components/AudioPlayer';
import { RepeatIcon } from 'lucide-react';

const SpeakingTask = ({
  onNextAction,
  done,
  recording,
  stream,
  audioURL,
  startRecording,
  chunksRef,
  resetAudioUrl,
  remainingTime,
}: SpeakingTypes) => {
  return (
    <div className="space-y-6 flex flex-col items-center mt-10">
      <p className={'text-4xl'}>Practice question </p>

      {!recording && !done && (
        <div className="relative flex flex-col items-center gap-4">
          <AudioPlayer src={null} onPlay={startRecording} permissionStep={true} />
          <p className="text-gray-500">Start to record</p>
        </div>
      )}

      {stream && recording && (
        <div className="relative flex flex-col items-center gap-4 w-full">
          <p className="text-blue-600 font-semibold animate-pulse">
            🎙️ Record in progress, {remainingTime} seconds...
          </p>
          <div className="w-full flex justify-center mt-4">
            <Spectrum stream={stream} />
          </div>
        </div>
      )}

      {audioURL && (
        <div className="space-y-4 flex flex-col items-center">
          <AudioPlayer src={audioURL} showSpectrum={true} permissionStep={true} />
          <div className="flex gap-4">
            <button className="btn bg-red-950 " onClick={resetAudioUrl}>
              <RepeatIcon />
            </button>
            <button
              className="btn"
              onClick={() => onNextAction(new Blob(chunksRef.current, { type: 'audio/webm' }))}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingTask;
