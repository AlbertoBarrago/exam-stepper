import { GET } from '../steps/route';
import { createClient } from '@/utils/supabase';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('/api/steps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch steps successfully', async () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'welcome',
        title: 'Welcome',
        sub_title: 'Welcome to the exam',
        duration_ms: null,
        record_ms: null,
        sentence: null,
        passage: null,
        audio_url: null,
        questions: null,
      },
      {
        id: 2,
        kind: 'reading-question',
        title: 'Reading Question',
        sub_title: null,
        duration_ms: null,
        record_ms: null,
        sentence: 'What is the main idea?',
        passage: null,
        audio_url: null,
        questions: [{ options: ['Option A', 'Option B', 'Option C'] }],
      },
      {
        id: 3,
        kind: 'listening-question',
        title: 'Listening Question',
        sub_title: null,
        duration_ms: null,
        record_ms: null,
        sentence: null,
        passage: null,
        audio_url: 'audio.mp3',
        questions: [{ question: 'What did you hear?' }],
      },
    ];

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockSteps,
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(3);
    expect(data[0]).toEqual(mockSteps[0]);
    expect(data[1]).toEqual({
      ...mockSteps[1],
      options: ['Option A', 'Option B', 'Option C'],
    });
    expect(data[2]).toEqual({
      ...mockSteps[2],
      questions: [{ question: 'What did you hear?' }],
      audioUrl: 'audio.mp3',
    });
  });

  it('should handle database error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database connection failed');
  });

  it('should handle no steps found', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('No steps found');
  });

  it('should handle speaking question type', async () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'speaking-question',
        title: 'Speaking Question',
        sub_title: null,
        duration_ms: null,
        record_ms: null,
        sentence: null,
        passage: null,
        audio_url: 'speaking-audio.mp3',
        questions: null,
      },
    ];

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockSteps,
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0]).toEqual({
      ...mockSteps[0],
      audioUrl: 'speaking-audio.mp3',
    });
  });

  it('should handle reading question list type', async () => {
    const mockSteps = [
      {
        id: 1,
        kind: 'reading-question-list',
        title: 'Reading Questions',
        sub_title: null,
        duration_ms: null,
        record_ms: null,
        sentence: null,
        passage: 'This is a reading passage.',
        audio_url: null,
        questions: [
          { question: 'Question 1', options: ['A', 'B', 'C'] },
          { question: 'Question 2', options: ['D', 'E', 'F'] },
        ],
      },
    ];

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockSteps,
            error: null,
          }),
        }),
      }),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0]).toEqual({
      ...mockSteps[0],
      questions: [
        { question: 'Question 1', options: ['A', 'B', 'C'] },
        { question: 'Question 2', options: ['D', 'E', 'F'] },
      ],
    });
  });

  it('should handle unknown error', async () => {
    mockCreateClient.mockRejectedValue(new Error('Unknown error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Unknown error');
  });
});