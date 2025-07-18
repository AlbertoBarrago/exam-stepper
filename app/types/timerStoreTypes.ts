import {Section} from "@/types/clientShellTypes";

interface TimerState {
    globalTimeLeft: number;
    sectionTimeLeft: number;
    currentSection: Section | null;
    isRunning: boolean;

    sectionElapsed: Record<Section, number>;

    tick: () => void;
    startSection: (section: Section) => void;
    start: () => void;
    pause: () => void;
}

export type {TimerState};