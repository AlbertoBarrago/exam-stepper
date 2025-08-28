export type FinalType = {
  sectionTimes: [string, number][];
  totalSeconds: number;
  analyzing: boolean;
  finalScore: number | null;
  cefrLevel: {
    global_cefr_level: string;
    reading_cefr_level?: string;
    listening_cefr_level?: string;
    speaking_cefr_level?: string;
    writing_cefr_level?: string;
  } | null;
  error: string | null;
  backToHome: () => void;
  displayName: string;
  awardedDate: string;
  stepScores: { [key: string]: number } | null;
};
