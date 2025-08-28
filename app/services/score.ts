import { StepResult } from '@/types/commonTypes';

const weights = {
  reading: 0.2,
  listening: 0.2,
  speaking: 0.4,
  writing: 0.2,
};

export function normalizeScore(raw: number, max: number): number {
  if (max === 0) return 0;
  return (raw / max) * 100;
}

export function calculateFinalScore(results: StepResult[]): number {
  const validResults = results.filter((result) => result.maxScore > 0);

  let totalWeight = 0;

  const weightedScoreSum = validResults.reduce((acc, result) => {
    const stepName = result.step.split('-')[0] as keyof typeof weights;
    const weight = weights[stepName];

    if (weight !== undefined) {
      totalWeight += weight;
      const norm = normalizeScore(result.rawScore, result.maxScore);
      return acc + norm * weight;
    }

    return acc;
  }, 0);

  if (totalWeight === 0) {
    return 0;
  }

  return weightedScoreSum / totalWeight;
}

export function mapToCEFR(score: number): 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' {
  if (score === 0 || score <= 20) return 'A0';
  if (score >= 21 && score <= 31) return 'A1';
  if (score >= 32 && score <= 41) return 'A2';
  if (score >= 42 && score <= 51) return 'B1';
  if (score >= 52 && score <= 61) return 'B2';
  if (score >= 62 && score <= 70) return 'C1';
  return 'C2';
}
