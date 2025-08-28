export type FinalType = {
  sectionTimes: [string, number][];
  totalSeconds: number;
  analyzing: boolean;
  finalScore: number | null;
  cefrLevel: string | null;
  error: string | null;
  backToHome: () => void;
  displayName: string;
  readingScore: number;
  readingLevel: string;
  listeningScore: number;
  listeningLevel: string;
  awardedDate: string;
};
