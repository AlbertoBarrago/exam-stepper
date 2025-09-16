/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../register/route';
import { createClient } from '@/utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user successfully', async () => {
    const mockSupabase = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
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
        insert: jest.fn().mockResolvedValue({
          data: [{
            id: 'user-123',
            username: 'testuser',
            display_name: 'Test User',
            email: 'test@example.com',
          }],
          error: null,
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: 'user-123',
      email: 'test@example.com',
    });
  });

  it('should handle missing username', async () => {
    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
        displayName: 'Test User',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('should handle missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        displayName: 'Test User',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('should handle missing displayName', async () => {
    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('should handle auth signup error', async () => {
    const mockSupabase = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Email already exists' },
        }),
      },
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email already exists');
  });

  it('should handle database error when creating user profile', async () => {
    const mockSupabase = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
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
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });
});