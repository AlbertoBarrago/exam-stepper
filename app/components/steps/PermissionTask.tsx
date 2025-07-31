'use client';
import React, { useRef, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { useRouter } from 'next/navigation';
import { NextTypes } from '@/types/commonTypes';

const PermissionTask = ({ onNextAction }: NextTypes) => {
  const [mode, setMode] = useState<'init' | 'recording' | 'ready'>('init');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string>('Premi il bottone e parla qualche secondo.');
  const router = useRouter();

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      setHint(`Im recording, say something...`);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        console.log('Recording blob url:', url);
        setAudioURL(url);
        setMode('ready');
        setHint('Press play and verify if you can hear the recording...');
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setMode('recording');
    } catch (err) {
      setError(`Access denied: ${err}`);
      setHint(`Access denied: ${err}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    }
  };

  const stepBack: () => void = () => {
    router.back();
  };

  return (
    <section className={'mt-10'}>
      <h1 className="text-2xl font-bold mb-4">Microphone Check</h1>
      <p className="mb-2">{hint}</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 24,
        }}
        aria-label={mode === 'init' ? 'Inizia registrazione' : 'Player audio'}
        tabIndex={0}
      >
        <AudioPlayer
          src={audioURL}
          recordingOptions={{
            enabled: mode === 'init' || mode === 'recording',
            onStart: startRecording,
            onEnd: stopRecording,
            duration: 5,
            autoStop: true,
          }}
          limitPlays={false}
        />
        {mode === 'init' && (
          <div className="mt-1 text-sm text-blue-500 animate-pulse">
            Press mic button to start recording
          </div>
        )}
        {mode === 'recording' && (
          <div className="mt-1 text-sm text-red-500 animate-pulse">Recording...</div>
        )}
        {mode === 'ready' && (
          <div className="mt-1 text-sm text-black">Can you hear the recording?</div>
        )}
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <button
        className="mt-4 px-4 py-2 bg-white-600 border rounded mr-2 cursor-pointer"
        onClick={stepBack}
      >
        No
      </button>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 cursor-pointer"
        onClick={onNextAction}
        disabled={!audioURL}
      >
        Yes works, proceed!
      </button>
    </section>
  );
};

export default PermissionTask;
