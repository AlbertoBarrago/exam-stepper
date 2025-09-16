import { NextRequest } from 'next/server';
import { POST } from '../exam/writing-analysis/route';

describe('/api/exam/writing-analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should analyze writing text successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({
        text: 'This is a sample essay about my favorite hobby. I enjoy reading books in my free time.',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis).toBeDefined();
  });

  it('should handle missing text', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('No text provided');
  });

  it('should handle empty text', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({
        text: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Text cannot be empty');
  });

  it('should return grammar score', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({
        text: 'This is a well-written essay with good grammar and structure.',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.analysis.grammarScore).toBeDefined();
    expect(data.analysis.vocabularyScore).toBeDefined();
    expect(data.analysis.coherenceScore).toBeDefined();
  });

  it('should handle analysis error', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({
        text: 'a'.repeat(10000), // Very long text
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should handle malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid request body');
  });

  it('should analyze different text lengths', async () => {
    const shortText = 'Hello world.';
    const longText = 'This is a much longer essay that contains multiple sentences and paragraphs. It demonstrates various writing skills and techniques.';

    const request1 = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({ text: shortText }),
    });

    const request2 = new NextRequest('http://localhost:3000/api/exam/writing-analysis', {
      method: 'POST',
      body: JSON.stringify({ text: longText }),
    });

    const response1 = await POST(request1);
    const response2 = await POST(request2);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
  });
});