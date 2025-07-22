import {create} from 'zustand';
import {Step} from '@/types/stepTypes';

interface StepState {
    steps: Step[];
    fetchSteps: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}


async function fetchStepsConfig(): Promise<Step[]> {
    const response = await fetch('/api/step');
    if (!response.ok) {
        throw new Error('Failed to fetch steps config');
    }
    return await response.json();
}

export const useStepStore = create<StepState>((set) => ({
    steps: [],
    isLoading: false,
    error: null,
    fetchSteps: async () => {
        set({isLoading: true, error: null});
        try {
            const data = await fetchStepsConfig();
            set({steps: data, isLoading: false});
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({error: errorMessage, isLoading: false});
            console.error("Failed to fetch steps config:", error);
        }
    },
}));