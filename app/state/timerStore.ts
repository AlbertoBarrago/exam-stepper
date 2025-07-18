import { create } from 'zustand';
import { SECTION_LIMITS, TOTAL_LIMIT } from '@/const/timesConst';
import {TimerState} from "@/types/timerStoreTypes";
import {Section} from "@/types/clientShellTypes";

/**
 * A Zustand store for managing a timer, including global and section-based timing functionalities.
 * This store is designed to track the elapsed time for different sections of an activity
 * and manage the state of a running timer.
 *
 * @constant {Object} useTimerStore
 * @property {number} globalTimeLeft - The total remaining time for the entire activity.
 * @property {number} sectionTimeLeft - The remaining time for the current section.
 * @property {string | null} currentSection - The identifier of the currently active section.
 * @property {boolean} isRunning - Indicates whether the timer is currently running.
 * @property {Object} sectionElapsed - Tracks the elapsed time for each section.
 * @property {function} tick - Decrements global and section time by 1 and updates elapsed time for the active section, called to simulate a timer tick.
 * @property {function} startSection - Initializes a new section and sets its time limit, marks the timer as running.
 * @property {function} start - Starts the timer without targeting any specific section.
 * @property {function} pause - Pauses the timer, stopping any updates to the time or elapsed states.
 */
export const useTimerStore = create<TimerState & {
    currentStepIndex: number;
    setCurrentStepIndex: (idx: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
}>((set, get) => ({
    globalTimeLeft: TOTAL_LIMIT,
    sectionTimeLeft: 0,
    currentSection: null,
    isRunning: false,
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
        const { globalTimeLeft, sectionTimeLeft, currentSection, isRunning, sectionElapsed } = get();
        if (!isRunning) return;
        set({
            globalTimeLeft: Math.max(0, globalTimeLeft - 1),
            sectionTimeLeft: Math.max(0, sectionTimeLeft - 1),
            sectionElapsed: currentSection
                ? { ...sectionElapsed, [currentSection]: sectionElapsed[currentSection] + 1 }
                : sectionElapsed
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
            sectionElapsed: {
                reading: 0,
                listening: 0,
                writing: 0,
                speaking: 0,
            },
            currentStepIndex: 0,
        }),
}));
