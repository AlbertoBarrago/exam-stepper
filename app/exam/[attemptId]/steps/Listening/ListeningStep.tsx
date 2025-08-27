'use client';
import AudioPlayer from '@/components/AudioPlayer';
import { useState, useRef } from 'react';
import { AudioQuestion } from '@/types/stepTypes';
import { useExamStore } from '@/state/examStore';

export default function ListeningStep({
  audioUrl,
  onNextAction,
}: {
  audioUrl: string;
  onNextAction: () => void;
  questions: AudioQuestion[];
}) {
  const setSectionScore = useExamStore((s) => s.setSectionScore);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop()); // Stop the microphone
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null); // Clear previous recording
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert(
        'Could not access microphone. Please ensure it is connected and permissions are granted.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleNext = async () => {
    if (!audioBlob) {
      alert('Please record your answer before proceeding.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.webm');

      const response = await fetch('/api/exam/listening-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawScore = data.score;
      const maxScore = data.maxScore;
      const detailedDescription = data.detailedDescription;

      setSectionScore('listening', { rawScore, maxScore });
      console.log('AI Detailed Description (Audio):', detailedDescription);

      onNextAction();
    } catch (error) {
      console.error('Error submitting audio for AI analysis:', error);
      alert('Failed to analyze audio. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <div className="text-left p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              You will have 6 different announcements at a conference. Read the 6 options and decide
              which one matches each announcement.
            </p>
            <p className="text-gray-700 mb-4">
              You can play the recording{' '}
              <span className="font-bold bg-gray-100 px-1 rounded">TWO</span> times.
            </p>
          </div>

          <div className="text-left float-left">
            <AudioPlayer src={audioUrl} showMetrics={true} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Record Your Answer</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isRecording
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              }`}
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !isRecording
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              }`}
            >
              Stop Recording
            </button>
          </div>
          {audioBlob && (
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Recorded Audio:</p>
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full"></audio>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
