import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SECTION_LIMITS, TOTAL_LIMIT } from '@/constants/timerConst';
import { TimerState } from '@/types/timerStoreTypes';
import { Section } from '@/types/clientShellTypes';

/**
 * A Zustand store for managing a timer, including global and section-based timing functionalities.
 * This store is designed to track the elapsed time for different sections of an activity
 * and manage the state of a running timer.
 */
export const useTimerStore = create<
  TimerState & {
    currentStepIndex: number;
    setCurrentStepIndex: (idx: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
  }
>()(
  persist(
    (set, get) => ({
      globalTimeLeft: TOTAL_LIMIT,
      sectionTimeLeft: 0,
      currentSection: null,
      isRunning: false,
      isTimeOver: false,
      sectionElapsed: {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      },
      currentStepIndex: 0,

      setCurrentStepIndex: (idx: number) => set({ currentStepIndex: idx }),
      nextStep: () => set({ currentStepIndex: get().currentStepIndex + 1 }),
      prevStep: () => set({ currentStepIndex: Math.max(0, get().currentStepIndex - 1) }),

      tick: () => {
        const { globalTimeLeft, sectionTimeLeft, currentSection, isRunning, sectionElapsed } =
          get();
        if (!isRunning) return;
        const newGlobalTimeLeft = Math.max(0, globalTimeLeft - 1);
        const newSectionTimeLeft = Math.max(0, sectionTimeLeft - 1);
        const timeIsOver = newGlobalTimeLeft === 0; // Each task can affect the end of an exam for this reason we evaluate the timeIsOver based on the globalTimeLeft

        set({
          globalTimeLeft: newGlobalTimeLeft,
          sectionTimeLeft: newSectionTimeLeft,
          sectionElapsed: currentSection
            ? { ...sectionElapsed, [currentSection]: sectionElapsed[currentSection] + 1 }
            : sectionElapsed,
          isRunning: timeIsOver ? false : isRunning, // Stop timer if time is over
          isTimeOver: timeIsOver, // Set isTimeOver to true if time is over
        });
      },

      startSection: (section: Section) =>
        set(() => ({
          sectionTimeLeft: SECTION_LIMITS[section],
          currentSection: section,
          isRunning: true,
        })),

      start: () => set({ isRunning: true }),
      pause: () => set({ isRunning: false }),

      reset: () =>
        set({
          globalTimeLeft: TOTAL_LIMIT,
          sectionTimeLeft: 0,
          currentSection: null,
          isRunning: false,
          isTimeOver: false,
          sectionElapsed: {
            reading: 0,
            listening: 0,
            writing: 0,
            speaking: 0,
          },
          currentStepIndex: 0,
        }),
    }),
    {
      name: 'timer-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStepIndex: state.currentStepIndex,
        sectionElapsed: state.sectionElapsed,
        globalTimeLeft: state.globalTimeLeft,
        sectionTimeLeft: state.sectionTimeLeft,
        currentSection: state.currentSection,
      }),
      skipHydration: true,
    }
  )
);
