/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../exam/speaking-analysis/route';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase';

jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/exam/speaking-analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle missing audio file', async () => {
    const formData = new FormData();

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle request without body', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should handle audio processing error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Audio processing failed' },
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as unknown as SupabaseClient);

    const mockAudioBlob = new Blob(['corrupted audio'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
  });

  it('should handle database connection error', async () => {
    mockCreateClient.mockRejectedValue(new Error('Database connection failed'));

    const mockAudioBlob = new Blob(['audio data'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('should handle large audio file', async () => {
    // Create a large mock audio blob (simulate file size limit)
    const largeAudioData = 'a'.repeat(10 * 1024 * 1024); // 10MB
    const mockAudioBlob = new Blob([largeAudioData], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'large-speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });
});