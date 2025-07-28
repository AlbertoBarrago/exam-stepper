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
  audioFileUrl,
  startRecording,
  chunksRef,
  resetAudioUrl,
  remainingTime,
  audioFinished,
  handleAudioEnd,
}: SpeakingTypes) => {
  return (
    <div className="space-y-6 flex flex-col items-center mt-10">
      <p className={'text-4xl'}>Practice question</p>

      {!recording && !done && audioFileUrl && !audioFinished && (
        <div className="relative flex flex-col items-center gap-4">
          <AudioPlayer
            src={audioFileUrl}
            permissionStep={true}
            isRecordMode={true}
            onEndedAction={handleAudioEnd}
          />
          <p className="text-gray-500">Start to listen</p>
        </div>
      )}

      {audioFinished && !recording && !done && (
        <div className="relative flex flex-col items-center gap-4">
          <AudioPlayer src={null} onPlayAction={startRecording} permissionStep={true} />
          <p className="text-gray-600 font-bold">
            Please answer the question by starting your recording.
          </p>
        </div>
      )}

      {stream && recording && (
        <div className="relative flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col items-center">
            <Spectrum stream={stream} />

            <p className="text-gray-600 font-semibold animate-pulse text-center mt-5">
              🎙️ Record in progress, {remainingTime} seconds...
            </p>
          </div>
        </div>
      )}

      {audioURL && (
        <div className="space-y-4 flex flex-col items-center">
          <AudioPlayer src={audioURL} showSpectrum={true} permissionStep={true} />
          <div className="flex gap-4">
            <button className="btn bg-red-950" onClick={resetAudioUrl}>
              <span className={'flex items-center gap-1'}>
                Retry <RepeatIcon size={15} />
              </span>
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
