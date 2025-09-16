import { NextRequest } from 'next/server';
import { POST, PUT } from '../exam/step-result/route';
import { createClient } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/exam/step-result', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should save step result successfully', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [{ id: 1 }],
                error: null,
              }),
            }),
          }),
        }),
      };

      mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'POST',
        body: JSON.stringify({
          examId: 123,
          stepId: 456,
          rawScore: 8,
          maxScore: 10,
          cefrLevel: 'B1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle missing examId', async () => {
      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'POST',
        body: JSON.stringify({
          stepId: 456,
          rawScore: 8,
          maxScore: 10,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing examId or stepId');
    });

    it('should handle missing stepId', async () => {
      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'POST',
        body: JSON.stringify({
          examId: 123,
          rawScore: 8,
          maxScore: 10,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing examId or stepId');
    });

    it('should handle database error', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      };

      mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'POST',
        body: JSON.stringify({
          examId: 123,
          stepId: 456,
          rawScore: 8,
          maxScore: 10,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Database error');
    });
  });

  describe('PUT', () => {
    it('should update step result successfully', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [{ id: 1 }],
                error: null,
              }),
            }),
          }),
        }),
      };

      mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'PUT',
        body: JSON.stringify({
          exam_id: '123',
          step_id: 456,
          time_spent_ms: 5000,
          visited: true,
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle missing exam_id', async () => {
      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'PUT',
        body: JSON.stringify({
          step_id: 456,
          time_spent_ms: 5000,
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing exam_id or step_id');
    });

    it('should handle missing step_id', async () => {
      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'PUT',
        body: JSON.stringify({
          exam_id: '123',
          time_spent_ms: 5000,
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing exam_id or step_id');
    });

    it('should handle database error', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        }),
      };

      mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

      const request = new NextRequest('http://localhost:3000/api/exam/step-result', {
        method: 'PUT',
        body: JSON.stringify({
          exam_id: '123',
          step_id: 456,
          time_spent_ms: 5000,
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Update failed');
    });
  });
});