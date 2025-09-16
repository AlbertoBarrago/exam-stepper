import { NextRequest } from 'next/server';
import { POST } from '../exam/[examId]/finalize/route';
import { createClient } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/exam/[examId]/finalize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should finalize exam successfully', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [
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
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [{ id: 123 }],
                error: null,
              }),
            }),
          }),
        }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as never);

    const request = new NextRequest('http://localhost:3000/api/exam/123/finalize', {
      method: 'POST',
      body: JSON.stringify({
        cefrLevelData: {
          global_cefr_level: 'B1',
          reading_cefr_level: 'B1',
          listening_cefr_level: 'A2',
        },
        stepScoresData: {
          reading_score: 8,
          listening_score: 7,
        },
      }),
    });

    const response = await POST(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle missing examId', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam//finalize', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request, { params: Promise.resolve({ examId: ''}) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid examId.');
  });

  it('should handle step results fetch error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Failed to fetch step results' },
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/finalize', {
      method: 'POST',
      body: JSON.stringify({
        cefrLevelData: { global_cefr_level: 'B1' },
        stepScoresData: {},
      }),
    });

    const response = await POST(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch step results');
  });

  it('should handle exam update error', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [
                {
                  raw_score: 8,
                  max_score: 10,
                  step_id: 1,
                  steps: { kind: 'reading-question' },
                },
              ],
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Failed to update exam' },
              }),
            }),
          }),
        }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/finalize', {
      method: 'POST',
      body: JSON.stringify({
        cefrLevelData: { global_cefr_level: 'B1' },
        stepScoresData: { reading_score: 8 },
      }),
    });

    const response = await POST(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to update exam');
  });

  it('should handle malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/123/finalize', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });

  it('should calculate final score correctly', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [
                {
                  raw_score: 8,
                  max_score: 10,
                  step_id: 1,
                  steps: { kind: 'reading-question' },
                },
                {
                  raw_score: 6,
                  max_score: 10,
                  step_id: 2,
                  steps: { kind: 'listening-question' },
                },
              ],
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [{ id: 123 }],
                error: null,
              }),
            }),
          }),
        }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/finalize', {
      method: 'POST',
      body: JSON.stringify({
        cefrLevelData: { global_cefr_level: 'B1' },
        stepScoresData: { reading_score: 8, listening_score: 6 },
      }),
    });

    const response = await POST(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.finalScore).toBeDefined();
  });
});