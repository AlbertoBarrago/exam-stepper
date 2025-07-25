import { create } from 'zustand';
import { StepState } from '@/types/stepTypes';
import { fetchStepsConfig } from '@/services/commonService';

export const useStepStore = create<StepState>((set) => ({
  steps: [],
  isLoading: false,
  error: null,
  fetchSteps: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchStepsConfig();
      set({ steps: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      console.error('Failed to fetch steps config:', error);
    }
  },
}));
