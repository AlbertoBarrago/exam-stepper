/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from '../exam/[examId]/step-results/route';
import { createClient } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/exam/[examId]/step-results', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch step results successfully', async () => {
    const mockStepResults = [
      {
        id: 1,
        exam_id: 123,
        step_id: 1,
        raw_score: 8,
        max_score: 10,
        cefr_level: 'B1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        steps: {
          id: 1,
          kind: 'reading-question',
          title: 'Reading Question',
        },
      },
      {
        id: 2,
        exam_id: 123,
        step_id: 2,
        raw_score: 7,
        max_score: 10,
        cefr_level: 'A2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        steps: {
          id: 2,
          kind: 'listening-question',
          title: 'Listening Question',
        },
      },
    ];

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockStepResults,
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/step-results');
    const response = await GET(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.examSteps).toEqual(mockStepResults);
  });

  it('should handle missing examId', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam//step-results');
    const response = await GET(request, { params: Promise.resolve({ examId: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing examId.');
  });

  it('should handle database error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'An unknow error occurred' },
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/step-results');
    const response = await GET(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('An unknow error occurred');
  });

  it('should handle empty results', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/step-results');
    const response = await GET(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.examSteps).toEqual([]);
  });

  it('should include step details in results', async () => {
    const mockStepResults = [
      {
        id: 1,
        exam_id: 123,
        step_id: 1,
        raw_score: 8,
        max_score: 10,
        cefr_level: 'B1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        steps: {
          id: 1,
          kind: 'reading-question',
          title: 'Reading Question',
          sub_title: 'Read the passage',
          duration_ms: 300000,
        },
      },
    ];

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockStepResults,
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/exam/123/step-results');
    const response = await GET(request, { params: Promise.resolve({ examId: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.examSteps[0].steps).toBeDefined();
    expect(data.examSteps[0].steps.kind).toBe('reading-question');
  });
});