import { create } from 'zustand';
import { SECTION_LIMITS, TOTAL_LIMIT } from './sectionTimes';

type Section = keyof typeof SECTION_LIMITS;

interface TimerState {
    globalTimeLeft: number;
    sectionTimeLeft: number;
    currentSection: Section | null;
    isRunning: boolean;

    sectionElapsed: Record<Section, number>;

    tick: () => void;
    startSection: (section: string) => void;
    start: () => void;
    pause: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
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

    startSection: (section) =>
        set(() => ({
            sectionTimeLeft: SECTION_LIMITS[section],
            currentSection: section,
            isRunning: true,
        })),

    start: () => set({ isRunning: true }),
    pause: () => set({ isRunning: false }),
}));