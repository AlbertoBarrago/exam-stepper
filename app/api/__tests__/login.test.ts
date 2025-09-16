import { NextRequest } from 'next/server';
import { POST } from '../login/route';
import { createClient } from '@/utils/supabase';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'user-123',
                username: 'testuser',
                display_name: 'Test User',
                email: 'test@example.com',
              },
              error: null,
            }),
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should return error for invalid credentials', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid login credentials');
  });

  it('should return error for missing credentials', async () => {
    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Username and password are required');
  });

  it('should handle database error when fetching user', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Database error');
  });

  it('should handle malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid request body');
  });
});