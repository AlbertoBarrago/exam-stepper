import {
  fetchStepsConfig,
  login,
  register,
  saveStepResult,
  startExam,
  finalizeExam,
} from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStepsConfig', () => {
    it('should fetch steps successfully', async () => {
      const mockSteps = [
        { id: 1, kind: 'welcome', title: 'Welcome' },
        { id: 2, kind: 'reading-intro', title: 'Reading Introduction' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSteps),
      });

      const result = await fetchStepsConfig();

      expect(result).toEqual(mockSteps);
      expect(global.fetch).toHaveBeenCalledWith('/api//steps');
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server Error'),
      });

      await expect(fetchStepsConfig()).rejects.toThrow('Failed to fetch steps config: 500 Internal Server Error');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const result = await login('testuser', 'password123');

      expect(result).toEqual({ success: true, user: mockUser });
      expect(global.fetch).toHaveBeenCalledWith('/api//login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
    });

    it('should handle login failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      });

      const result = await login('testuser', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await login('testuser', 'password123');

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'newuser',
        displayName: 'New User',
        email: 'new@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      const result = await register('newuser', 'password123', 'New User');

      expect(result).toEqual({ success: true, user: mockUser });
      expect(global.fetch).toHaveBeenCalledWith('/api//register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'newuser',
          password: 'password123',
          displayName: 'New User',
        }),
      });
    });

    it('should handle registration failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Username already exists' }),
      });

      const result = await register('existinguser', 'password123', 'Existing User');

      expect(result).toEqual({
        success: false,
        error: 'Username already exists',
      });
    });
  });

  describe('saveStepResult', () => {
    it('should save step result successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await saveStepResult(1, 2, 8, 10, 'B1');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith('/api//exam/step-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: 1,
          stepId: 2,
          rawScore: 8,
          maxScore: 10,
          cefrLevel: 'B1',
        }),
      });
    });

    it('should handle save step result failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save result' }),
      });

      const result = await saveStepResult(1, 2, 8, 10);

      expect(result).toEqual({
        success: false,
        error: 'Failed to save result',
      });
    });
  });

  describe('startExam', () => {
    it('should start exam successfully', async () => {
      const mockExamData = {
        success: true,
        examId: 123,
        examSteps: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExamData),
      });

      const result = await startExam('user123', [1, 2, 3]);

      expect(result).toEqual(mockExamData);
      expect(global.fetch).toHaveBeenCalledWith('/api//exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123',
          stepIds: [1, 2, 3],
        }),
      });
    });

    it('should handle start exam failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to start exam' }),
      });

      const result = await startExam('user123', [1, 2, 3]);

      expect(result).toEqual({
        success: false,
        error: 'Failed to start exam',
      });
    });
  });

  describe('finalizeExam', () => {
    it('should finalize exam successfully', async () => {
      const mockStepResults = {
        examSteps: [
          {
            raw_score: 8,
            max_score: 10,
            step_id: 1,
            steps: { kind: 'reading-question' },
          },
          {
            raw_score: 7,
            max_score: 10,
            step_id: 2,
            steps: { kind: 'listening-question' },
          },
        ],
      };

      const mockFinalizeResponse = {
        success: true,
        finalScore: 75,
        exam: {
          cefr_level: { global_cefr_level: 'B1' },
          final_score: 75,
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockStepResults),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockFinalizeResponse),
        });

      const result = await finalizeExam(123);

      expect(result.success).toBe(true);
      expect(result.finalScore).toBe(75);
      expect(result.exam).toBeDefined();
      expect(result.stepScores).toBeDefined();
    });

    it('should handle finalize exam failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to fetch step results' }),
      });

      const result = await finalizeExam(123);

      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch step results',
      });
    });
  });
});