import { create } from 'zustand';

interface SectionScore {
  rawScore: number;
  maxScore: number;
}

interface ExamStore {
  examId: number | null;
  setExamId: (id: number) => void;
  sectionScores: Record<string, SectionScore>;
  setSectionScore: (section: string, score: SectionScore) => void;
  resetSectionScores: () => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  examId: null,
  setExamId: (id) => set({ examId: id }),
  sectionScores: {},
  setSectionScore: (section, score) =>
    set((state) => ({
      sectionScores: {
        ...state.sectionScores,
        [section]: {
          rawScore: (state.sectionScores[section]?.rawScore || 0) + score.rawScore,
          maxScore: (state.sectionScores[section]?.maxScore || 0) + score.maxScore,
        },
      },
    })),
  resetSectionScores: () => set({ sectionScores: {} }),
}));
