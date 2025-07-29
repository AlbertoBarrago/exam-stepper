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
  mode,
  stopEndRecording,
  durationMs = 5000,
}: SpeakingTypes) => {
  return (
    <div className="space-y-6 flex flex-col items-center mt-10">
      <p className={'text-4xl'}>Practice question</p>

      {!recording && !done && audioFileUrl && !audioFinished && (
        <div className="relative flex flex-col items-center gap-4">
          <AudioPlayer src={audioFileUrl} limitPlays={false} onEndedAction={handleAudioEnd} />
          <p className="text-gray-500">Start to listen</p>
        </div>
      )}

      {audioFinished && !done && (
        <div className="relative flex flex-col items-center gap-4">
          <AudioPlayer
            src={audioURL}
            recordingDuration={durationMs! / 1000}
            limitPlays={false}
            isRecordMode={mode === 'init' || mode === 'recording'}
            onRecordStartAction={startRecording}
            onRecordEndAction={stopEndRecording}
            autoStopRecording={true}
            showSpectrum={true}
            stream={stream}
          />
          <p className="text-gray-600 font-bold">
            {recording ? (
              <span className="flex items-center animate-pulse">
                🎙️ Registrazione in corso, {remainingTime} secondi...
              </span>
            ) : (
              <span>Inizia a registrare la tua risposta (durata: {durationMs / 1000} secondi)</span>
            )}
          </p>
        </div>
      )}

      {stream && recording && (
        <div className="relative flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col items-center"></div>
        </div>
      )}

      {audioURL && (
        <div className="space-y-4 flex flex-col items-center">
          <AudioPlayer src={audioURL} showSpectrum={true} limitPlays={false} />
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
