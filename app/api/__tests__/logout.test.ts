import { NextRequest } from 'next/server';
import { POST } from '../logout/route';
import { createClient } from '@/utils/supabase';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should logout user successfully', async () => {
    const mockSupabase = {
      auth: {
        signOut: jest.fn().mockResolvedValue({
          error: null,
        }),
      },
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logged out successfully');
  });

  it('should handle logout error', async () => {
    const mockSupabase = {
      auth: {
        signOut: jest.fn().mockResolvedValue({
          error: { message: 'Logout failed' },
        }),
      },
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Logout failed');
  });

  it('should handle network error', async () => {
    mockCreateClient.mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Network error');
  });
});