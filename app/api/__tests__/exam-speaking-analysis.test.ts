import { NextRequest } from 'next/server';
import { POST } from '../exam/speaking-analysis/route';

describe('/api/exam/speaking-analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should analyze speaking audio successfully', async () => {
    const mockAudioBlob = new Blob(['audio data'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis).toBeDefined();
  });

  it('should handle missing audio file', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('No audio file provided');
  });

  it('should handle invalid audio format', async () => {
    const mockFile = new Blob(['invalid data'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('audio', mockFile, 'invalid.txt');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid audio format');
  });

  it('should handle analysis error', async () => {
    const mockAudioBlob = new Blob(['corrupted audio'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should return pronunciation score', async () => {
    const mockAudioBlob = new Blob(['audio data'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', mockAudioBlob, 'speaking.webm');

    const request = new NextRequest('http://localhost:3000/api/exam/speaking-analysis', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.analysis.pronunciationScore).toBeDefined();
    expect(data.analysis.fluencyScore).toBeDefined();
    expect(data.analysis.grammarScore).toBeDefined();
  });
});