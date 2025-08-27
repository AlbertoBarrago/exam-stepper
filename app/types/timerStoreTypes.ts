import { Section } from '@/types/clientShellTypes';

export type TimerState = {
  globalTimeLeft: number;
  sectionTimeLeft: number;
  currentSection: Section | null;
  isRunning: boolean;
  isTimeOver: boolean;
  sectionElapsed: Record<Section, number>;
  tick: () => void;
  startSection: (section: Section) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
};
