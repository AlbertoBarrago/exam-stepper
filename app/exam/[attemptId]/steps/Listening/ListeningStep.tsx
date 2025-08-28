'use client';
import AudioPlayer from '@/components/AudioPlayer';
import { useState } from 'react';
import { AudioQuestion } from '@/types/stepTypes';
import { useExamStore } from '@/state/examStore';
import { saveStepResult } from '@/services/api';
import { useStepStore } from '@/state/stepStore';
import { useTimerStore } from '@/state/timerStore';

export default function ListeningStep({
  audioUrl,
  onNextAction,
  questions,
}: {
  audioUrl: string;
  onNextAction: () => void;
  questions: AudioQuestion[];
}) {
  const setSectionScore = useExamStore((s) => s.setSectionScore);
  const examId = useExamStore((s) => s.examId);
  const { steps } = useStepStore();
  const currentStepIndex = useTimerStore((s) => s.currentStepIndex);
  const stepId = steps[currentStepIndex]?.id;
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showError, setShowError] = useState(false);

  const handleNext = async () => {
    const allFilled = answers.every((ans) => ans !== null);
    if (!allFilled) {
      setShowError(true);
      return;
    }
    setShowError(false);

    const rawScore = questions.reduce((score, question, index) => {
      const correctOption = question.options.find((option) => option.is_correct);
      const isCorrect = answers[index] === correctOption?.id;
      return score + (isCorrect ? 1 : 0);
    }, 0);

    const maxScore = questions.length;

    setSectionScore('listening', { rawScore, maxScore });

    if (examId && stepId) {
      await saveStepResult(examId, stepId, rawScore, maxScore);
    }

    onNextAction();
  };

  const handleAnswerChange = (i: number, value: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[i] = value;
      return newAnswers;
    });
    if (showError) setShowError(false);
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Announcement {i + 1}</div>
                  <div className="text-gray-700 mb-3">{q.before}</div>
                  <div className="space-y-2">
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`${q.id}-${option.id}`}
                          name={`announcement-${i}`}
                          value={option.value}
                          checked={answers[i] === option.id}
                          onChange={() => handleAnswerChange(i, option.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor={`${q.id}-${option.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showError && (
        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-red-700 text-sm font-medium">
            Please complete all announcements before continuing.
          </p>
        </div>
      )}

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
