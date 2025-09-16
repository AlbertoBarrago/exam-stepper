import { NextRequest } from 'next/server';
import { POST } from '../exam/start/route';
import { createClient } from '@/utils/supabase';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/exam/start', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start exam successfully', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{ id: 123 }],
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as never);

    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        stepIds: [1, 2, 3],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.examId).toBe(123);
  });

  it('should handle missing userId', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        stepIds: [1, 2, 3],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing userId or stepIds.');
  });

  it('should handle missing stepIds', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing userId or stepIds.');
  });

  it('should handle empty stepIds array', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        stepIds: [],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing userId or stepIds.');
  });

  it('should handle exam creation error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        stepIds: [1, 2, 3],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Database error');
  });

  it('should handle exam steps creation error', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [{ id: 123 }],
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Steps creation error' },
            }),
          }),
        }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        stepIds: [1, 2, 3],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Steps creation error');
  });

  it('should handle malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/start', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});