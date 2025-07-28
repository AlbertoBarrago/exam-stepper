'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import Spectrum from '@/components/Spectrum';
import { CircularAudioPlayerProps } from '@/types/audioPlayerTypes';

export default function AudioPlayer({
  src,
  duration,
  permissionStep,
  limitPlays = true,
  showMetrics = false,
  showSpectrum = false,
  onPlayAction,
  onEndedAction,
  isRecordMode = false,
  onRecordStartAction,
  onRecordEndAction,
  autoStopRecording = false,
}: CircularAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [recordingElapsedTime, setRecordingElapsedTime] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const handlePlay = () => {
    if (onPlayAction) {
      onPlayAction();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!permissionStep && limitPlays && playCount >= 2) return;

    audio.currentTime = 0;
    audio.play();
    setIsPlaying(true);
    setPlayCount((count) => count + 1);
    setProgress(0);
    setElapsedTime(0);

    // Setup spectrum if enabled
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
    if (onRecordStartAction) {
      onRecordStartAction();
    }
  };

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (onRecordEndAction) {
      onRecordEndAction();
    }
  }, [onRecordEndAction]);

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleButtonClick = () => {
    if (isRecordMode) {
      handleRecordToggle();
    } else {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
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
        : Number.isFinite(duration)
          ? duration
          : 0;
      setAudioDuration(actualDuration!);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onEndedAction) {
        onEndedAction();
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
        audioContextRef.current.close();
        audioContextRef.current = null;
        audioSourceNodeRef.current = null;
      }
    };
  }, [duration, src, onEndedAction]);

  useEffect(() => {
    if (isRecording && autoStopRecording && duration && Number.isFinite(duration)) {
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
      }, duration * 1000);

      return () => {
        clearInterval(updateInterval);
        if (recordingTimerRef.current) {
          clearTimeout(recordingTimerRef.current);
        }
      };
    }
  }, [isRecording, autoStopRecording, duration, audioDuration, stopRecording]);

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

  const isButtonDisabled = isRecordMode
    ? false
    : permissionStep
      ? false
      : limitPlays && playCount >= 2 && !isPlaying;

  const maxPlays = permissionStep ? Infinity : 2;
  const remainingPlays = maxPlays === Infinity ? Infinity : Math.max(0, maxPlays - playCount);

  // Determine which icon to show
  const renderIcon = () => {
    if (isRecordMode) {
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

  // Determine button background color
  const getButtonBackgroundColor = () => {
    if (isRecordMode) {
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
            isRecordMode
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

        {(isPlaying || isRecording) && showSpectrum && (
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
                : formatTime(isRecording ? duration || 0 : 0)}
            </div>
          </div>

          {!permissionStep && limitPlays && !isRecordMode && (
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
