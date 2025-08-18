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
  console.log('calculateFinalScore received results:', JSON.stringify(results, null, 2));
  const validResults = results.filter(result => result.maxScore > 0);
  console.log('Filtered results (maxScore > 0):', JSON.stringify(validResults, null, 2));

  let totalWeight = 0;

  const weightedScoreSum = validResults.reduce((acc, result) => {
    const stepName = result.step.split('-')[0] as keyof typeof weights;
    const weight = weights[stepName];

    if (weight !== undefined) {
      totalWeight += weight;
      const norm = normalizeScore(result.rawScore, result.maxScore);
      const weightedScore = norm * weight;
      console.log(`  - Step: ${result.step}, Normalized: ${norm}, Weight: ${weight}, Weighted Score: ${weightedScore}`);
      return acc + weightedScore;
    }

    return acc;
  }, 0);

  console.log(`Total weight: ${totalWeight}`);
  console.log(`Weighted score sum: ${weightedScoreSum}`);

  if (totalWeight === 0) {
    console.log('Total weight is 0, returning 0');
    return 0;
  }

  const finalScore = weightedScoreSum / totalWeight;
  console.log(`Final score: ${finalScore}`);
  return finalScore;
}

export function mapToCEFR(score: number): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' {
  if (score < 30) return 'A1';
  if (score < 40) return 'A2';
  if (score < 60) return 'B1';
  if (score < 75) return 'B2';
  if (score < 90) return 'C1';
  return 'C2';
}
