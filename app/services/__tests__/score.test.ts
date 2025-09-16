import { normalizeScore, calculateFinalScore, mapToCEFR } from '../score';
import { StepResult } from '@/types/commonTypes';

describe('Score Utilities', () => {
  describe('normalizeScore', () => {
    it('should normalize score correctly', () => {
      expect(normalizeScore(8, 10)).toBe(80);
      expect(normalizeScore(5, 10)).toBe(50);
      expect(normalizeScore(0, 10)).toBe(0);
      expect(normalizeScore(10, 10)).toBe(100);
    });

    it('should handle zero max score', () => {
      expect(normalizeScore(5, 0)).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(normalizeScore(3, 7)).toBeCloseTo(42.86, 2);
    });
  });

  describe('calculateFinalScore', () => {
    it('should calculate final score with weighted sections', () => {
      const results: StepResult[] = [
        {
          step: 'reading-question',
          rawScore: 8,
          maxScore: 10,
        },
        {
          step: 'listening-question',
          rawScore: 7,
          maxScore: 10,
        },
        {
          step: 'speaking-question',
          rawScore: 9,
          maxScore: 10,
        },
        {
          step: 'writing-question',
          rawScore: 6,
          maxScore: 10,
        },
      ];

      const finalScore = calculateFinalScore(results);
      
      // Expected: (80*0.2 + 70*0.2 + 90*0.4 + 60*0.2) / 1.0 = 78
      expect(finalScore).toBeCloseTo(78, 2);
    });

    it('should handle empty results', () => {
      const results: StepResult[] = [];
      const finalScore = calculateFinalScore(results);
      expect(finalScore).toBe(0);
    });

    it('should handle results with zero max scores', () => {
      const results: StepResult[] = [
        {
          step: 'reading-question',
          rawScore: 5,
          maxScore: 0,
        },
        {
          step: 'listening-question',
          rawScore: 7,
          maxScore: 10,
        },
      ];

      const finalScore = calculateFinalScore(results);
      // Only listening should count: 70 * 0.2 / 0.2 = 70
      expect(finalScore).toBe(70);
    });

    it('should handle unknown step types', () => {
      const results: StepResult[] = [
        {
          step: 'unknown-step',
          rawScore: 8,
          maxScore: 10,
        },
        {
          step: 'reading-question',
          rawScore: 7,
          maxScore: 10,
        },
      ];

      const finalScore = calculateFinalScore(results);
      // Only reading should count: 70 * 0.2 / 0.2 = 70
      expect(finalScore).toBe(70);
    });
  });

  describe('mapToCEFR', () => {
    it('should map scores to correct CEFR levels', () => {
      expect(mapToCEFR(0)).toBe('A0');
      expect(mapToCEFR(10)).toBe('A0');
      expect(mapToCEFR(20)).toBe('A0');
      expect(mapToCEFR(21)).toBe('A1');
      expect(mapToCEFR(25)).toBe('A1');
      expect(mapToCEFR(31)).toBe('A1');
      expect(mapToCEFR(32)).toBe('A2');
      expect(mapToCEFR(35)).toBe('A2');
      expect(mapToCEFR(41)).toBe('A2');
      expect(mapToCEFR(42)).toBe('B1');
      expect(mapToCEFR(45)).toBe('B1');
      expect(mapToCEFR(51)).toBe('B1');
      expect(mapToCEFR(52)).toBe('B2');
      expect(mapToCEFR(55)).toBe('B2');
      expect(mapToCEFR(61)).toBe('B2');
      expect(mapToCEFR(62)).toBe('C1');
      expect(mapToCEFR(65)).toBe('C1');
      expect(mapToCEFR(70)).toBe('C1');
      expect(mapToCEFR(71)).toBe('C2');
      expect(mapToCEFR(85)).toBe('C2');
      expect(mapToCEFR(100)).toBe('C2');
    });

    it('should handle edge cases', () => {
      expect(mapToCEFR(-5)).toBe('A0');
      expect(mapToCEFR(1000)).toBe('C2');
    });
  });
});