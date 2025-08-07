'use client';
import ConfirmModal from '@/components/ConfirmModal';
import { useUserStore } from '@/state/userStore';
import { useTimerStore } from '@/state/timerStore';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionTimerBar from '@/components/TimeBar';
import { QUESTION_KINDS, stepKindToSection } from '@/constants/clientShellConst';
import { useStepStore } from '@/state/stepStore';
import { isSection } from '@/services/utilService';

function TickController(): null {
  const tick = useTimerStore((s) => s.tick);
  const isRunning = useTimerStore((s) => s.isRunning);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);
  return null;
}

export default function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { steps, isLoading: isLoadingSteps } = useStepStore();
  const { currentStepIndex, reset: resetTimer, startSection, pause } = useTimerStore();

  const prevStepKindRef = useRef<string | undefined>(undefined);
  const [showTimeBar, setShowTimeBar] = useState(true); // New state to control visibility

  const handleLogout = () => {
    logout();
    resetTimer();
    setOpen(false);
    router.push('/');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoToHome = () => {
    setIsModalOpen(true);
  };

  const handleConfirmGoToHome = () => {
    resetTimer();
    setOpen(false);
    router.push('/');
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const step = !isLoadingSteps && steps.length > 0 ? steps[currentStepIndex] : null;
  const section = step ? stepKindToSection(step.kind) : null;

  useEffect(() => {
    if (!step) return;

    const currentKind = step.kind;
    const prevKind = prevStepKindRef.current;
    const thisSection = stepKindToSection(currentKind);

    if (QUESTION_KINDS.includes(currentKind) || currentKind.endsWith('-login')) {
      setShowTimeBar(true);
      if (
        prevKind &&
        stepKindToSection(prevKind) === thisSection &&
        prevKind.endsWith('-login') &&
        isSection(thisSection)
      ) {
        startSection(thisSection);
      }
    } else if (currentKind.endsWith('-complete')) {
      pause();
      setShowTimeBar(false);
    }

    prevStepKindRef.current = currentKind;
  }, [currentStepIndex, startSection, pause, step, setShowTimeBar]);

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between bg-white shadow sticky top-0 z-50 border-b-blue-600 border-b-3">
      <div className="text-xl font-bold text-blue-700 cursor-pointer" onClick={handleGoToHome}>
        English Exam
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmGoToHome}
        title="Confirm Navigation"
        message="Are you sure you want to leave the exam? Your progress will not be saved."
      />
      {showTimeBar && <SectionTimerBar displaySection={isSection(section) ? section : null} />}
      <TickController />
      <div className="relative" ref={menuRef}>
        {user && (
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-800">
              {user.user_metadata?.display_name.charAt(0).toUpperCase() || 'U'}
            </span>
            <span className="font-medium">{user.user_metadata?.display_name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
        {open && user && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded z-20">
            <div className="px-4 py-2 text-gray-700 text-sm truncate">{user.email}</div>
            <button
              className="w-full text-left px-4 py-1 cursor-pointer hover:bg-gray-100 text-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
