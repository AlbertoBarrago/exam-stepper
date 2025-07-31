import { StepResult } from '@/types/commonTypes';

const weights = {
  reading: 0.2,
  listening: 0.2,
  speaking: 0.4,
  writing: 0.2,
};

function normalizeScore(raw: number, max: number): number {
  return (raw / max) * 100;
}

export function calculateFinalScore(results: StepResult[]): number {
  return results.reduce((acc, result) => {
    const norm = normalizeScore(result.rawScore, result.maxScore);
    return acc + norm * weights[result.step];
  }, 0);
}

export function mapToCEFR(score: number): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' {
  if (score < 30) return 'A1';
  if (score < 40) return 'A2';
  if (score < 60) return 'B1';
  if (score < 75) return 'B2';
  if (score < 90) return 'C1';
  return 'C2';
}
