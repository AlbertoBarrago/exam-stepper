import { create } from 'zustand';

interface ExamStore {
  examId: number | null;
  setExamId: (id: number) => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  examId: null,
  setExamId: (id) => set({ examId: id }),
}));
