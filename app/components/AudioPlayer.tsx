'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import Spectrum from '@/components/Spectrum';
import { CircularAudioPlayerProps } from '@/types/audioPlayerTypes';

/**
 * A versatile audio component that can function as both an audio player and a voice recorder.
 * It displays a circular progress bar and can show a spectrum analysis of the audio.
 *
 * @component
 * @param {string} [src] - The URL of the audio file to be played. Required for player mode.
 * @param {MediaStream} [stream] - The media stream to use for recording or visualization.
 * @param {() => void} [onPlayAction] - A custom function to execute when the play button is clicked. Overrides the default play behavior.
 * @param {() => void} [onEndAction] - A callback function that is triggered when the audio playback completes.
 * @param {boolean} [limitPlays=true] - If true, limits the number of times the audio can be played to a maximum of two.
 * @param {boolean} [showMetrics=false] - If true, displays playback time, duration, and remaining plays.
 * @param {boolean} [showSpectrum=false] - If true, displays a spectrum visualizer during playback or recording.
 * @param {object} [recordingOptions] - Configuration for recording functionality.
 * @param {boolean} [recordingOptions.enabled=false] - If true, the component operates in recording mode.
 * @param {number} [recordingOptions.duration] - The maximum duration of the recording in seconds.
 * @param {boolean} [recordingOptions.autoStop=false] - If true, the recording stops automatically after the specified duration.
 * @param {() => void} [recordingOptions.onStart] - A callback function executed when recording starts.
 * @param {() => void} [recordingOptions.onEnd] - A callback function executed when recording ends.
 * @returns {React.ReactElement} The rendered AudioPlayer component.
 */
export default function AudioPlayer({
  src,
  stream,
  onPlayAction,
  onEndAction,
  limitPlays = true,
  showMetrics = false,
  showSpectrum = false,
  recordingOptions,
}: CircularAudioPlayerProps): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(recordingOptions?.duration || 0);
  const [recordingElapsedTime, setRecordingElapsedTime] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const handlePlay = async () => {
    if (onPlayAction) {
      onPlayAction();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (limitPlays && playCount >= 2) return;

    if (!audio.duration && audio.readyState === 0) {
      try {
        await new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
        });
      } catch (e) {
        console.error('Error loading audio metadata:', e);
        return;
      }
    }

    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      void audio.play();
    }, 0);

    setIsPlaying(true);
    setPlayCount((count) => count + 1);
    setProgress(0);
    setElapsedTime(0);

    if (showSpectrum && !audioSourceNodeRef.current) {
      const AudioContext = window.AudioContext;
      if (AudioContext) {
        const context = new AudioContext();
        audioContextRef.current = context;
        const source = context.createMediaElementSource(audio);
        audioSourceNodeRef.current = source;
        const destination = context.createMediaStreamDestination();
        source.connect(destination);
        source.connect(context.destination);
        setAudioStream(destination.stream);
      }
    }
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    audio.pause();
    setIsPlaying(false);
    setElapsedTime(0);
  };

  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    if (recordingOptions?.onStart) {
      recordingOptions?.onStart();
    }
  };

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recordingOptions?.onEnd) {
      recordingOptions?.onEnd();
    }
  }, [recordingOptions]);

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleButtonClick = () => {
    if (recordingOptions?.enabled) {
      handleRecordToggle();
    } else {
      if (isPlaying) {
        handlePause();
      } else {
        void handlePlay();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (stream && recordingOptions?.enabled) {
      setAudioStream(stream);
    }
  }, [stream, recordingOptions?.enabled]);

  useEffect(() => {
    if (!isPlaying) setProgress(0);
  }, [isPlaying, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;
      setProgress(audio.currentTime / audio.duration);
      setElapsedTime(audio.currentTime);
    };

    const setMetaDuration = () => {
      // Make sure we have a valid, finite duration
      const actualDuration = Number.isFinite(audio.duration)
        ? audio.duration
        : Number.isFinite(recordingOptions?.duration)
          ? recordingOptions?.duration
          : 0;
      setAudioDuration(actualDuration!);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onEndAction) {
        onEndAction();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setMetaDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setMetaDuration);
      audio.removeEventListener('ended', handleEnded);
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
        audioSourceNodeRef.current = null;
      }
    };
  }, [recordingOptions?.duration, src, onEndAction]);

  useEffect(() => {
    if (
      isRecording &&
      recordingOptions?.autoStop &&
      recordingOptions?.duration &&
      Number.isFinite(recordingOptions?.duration)
    ) {
      const updateInterval = setInterval(() => {
        setRecordingElapsedTime((prev) => {
          const newTime = prev + 0.1;
          if (audioDuration > 0) {
            setProgress(newTime / audioDuration);
          }
          return newTime;
        });
      }, 100);

      recordingTimerRef.current = setTimeout(() => {
        stopRecording();
      }, recordingOptions?.duration * 1000);

      return () => {
        clearInterval(updateInterval);
        if (recordingTimerRef.current) {
          clearTimeout(recordingTimerRef.current);
        }
      };
    }
  }, [
    isRecording,
    recordingOptions?.autoStop,
    recordingOptions?.duration,
    audioDuration,
    stopRecording,
  ]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingElapsedTime(0);
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  }, [isRecording]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const displayProgress = progress;

  const isButtonDisabled = recordingOptions?.enabled
    ? false
    : limitPlays && playCount >= 2 && !isPlaying;

  const maxPlays = limitPlays ? 2 : Infinity;
  const remainingPlays = maxPlays === Infinity ? Infinity : Math.max(0, maxPlays - playCount);

  const renderIcon = () => {
    if (recordingOptions?.enabled) {
      return isRecording ? (
        <Pause
          size={40}
          strokeWidth={2}
          style={{
            color: '#2563eb',
            transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ) : (
        <Mic
          size={40}
          strokeWidth={2}
          style={{
            color: '#ffffff',
            transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      );
    } else {
      return isPlaying ? (
        <Pause
          size={40}
          strokeWidth={2}
          style={{
            color: '#2563eb',
            transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ) : (
        <Play
          size={40}
          strokeWidth={2}
          style={{
            color: '#ffffff',
            transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      );
    }
  };

  const getButtonBackgroundColor = () => {
    if (recordingOptions?.enabled) {
      return isRecording ? '#ffffff' : '#d21d1d';
    } else {
      return isPlaying ? '#ffffff' : '#2563eb';
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {src && (
          <audio
            ref={audioRef}
            src={src}
            preload="auto"
            style={{ display: 'none' }}
            crossOrigin="anonymous"
          />
        )}

        <button
          onClick={handleButtonClick}
          aria-label={
            recordingOptions?.enabled
              ? isRecording
                ? 'Stop Recording'
                : 'Start Recording'
              : isPlaying
                ? 'Pause Audio'
                : 'Play Audio'
          }
          disabled={isButtonDisabled}
          className="z-10 rounded-full shadow-lg w-16 h-16 flex items-center justify-center focus:outline-none"
          style={{
            backgroundColor: getButtonBackgroundColor(),
            opacity: isButtonDisabled ? 0.6 : 1,
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderIcon()}
        </button>

        <svg className="absolute top-0 left-0" width={128} height={128}>
          <circle cx={64} cy={64} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={8} />
          <circle
            cx={64}
            cy={64}
            r={radius}
            fill="none"
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - displayProgress * circumference}
            strokeLinecap="round"
            style={{
              stroke: '#2563eb',
              transition: 'stroke-dashoffset 0.3s linear, stroke 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {(isPlaying || isRecording) && showSpectrum && audioStream && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-full flex items-center justify-center -z-10">
            <Spectrum stream={audioStream} />
          </div>
        )}
      </div>

      {showMetrics && (
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="bg-gray-50 px-3 py-2 rounded-lg">
            <div className="font-medium text-gray-700 mb-1">Time Elapsed</div>
            <div className="font-mono text-blue-600">
              {formatTime(isRecording ? recordingElapsedTime : elapsedTime)}/
              {audioDuration > 0
                ? formatTime(audioDuration)
                : formatTime(isRecording ? recordingOptions?.duration || 0 : 0)}
            </div>
          </div>

          {limitPlays && !recordingOptions?.enabled && (
            <div className="bg-gray-50 px-3 py-2 rounded-lg">
              <div className="font-medium text-gray-700 mb-1">Plays Remaining</div>
              <div
                className={`font-mono ${remainingPlays === 0 ? 'text-red-600' : 'text-blue-600'}`}
              >
                {remainingPlays}/{maxPlays}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
