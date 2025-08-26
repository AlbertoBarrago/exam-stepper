import React from 'react';
import { useTimerStore } from '@/state/timerStore';
import { useRouter } from 'next/navigation';

const TimeOverMessage = () => {
  const isTimeOver = useTimerStore((state) => state.isTimeOver);
  const router = useRouter();

  if (!isTimeOver) {
    return null;
  }

  const goToLogin = () => {
    void router.push('/login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Time is Over!</h2>
        <p className="text-lg text-gray-800">
          You failed to complete the exam within the allotted time.
        </p>
        <button className="text-md text-gray-600 mt-2 btn btn-primary" onClick={goToLogin}>
          Please try again.
        </button>
      </div>
    </div>
  );
};

export default TimeOverMessage;
