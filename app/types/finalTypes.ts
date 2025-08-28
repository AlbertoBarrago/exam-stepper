export type FinalType = {
  sectionTimes: [string, number][];
  totalSeconds: number;
  analyzing: boolean;
  finalScore: number | null;
  cefrLevel: string | null;
  error: string | null;
  backToHome: () => void;
  displayName: string;
  awardedDate: string;
};
