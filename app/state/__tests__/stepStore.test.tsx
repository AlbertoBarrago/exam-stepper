import { renderHook, act } from '@testing-library/react';
import { useStepStore } from '../stepStore';
import { fetchStepsConfig } from '@/services/api';

// Mock the API service
jest.mock('@/services/api', () => ({
  fetchStepsConfig: jest.fn(),
}));

const mockFetchStepsConfig = fetchStepsConfig as jest.MockedFunction<typeof fetchStepsConfig>;

describe('StepStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the store state before each test
    useStepStore.setState({
      steps: [],
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useStepStore());
    
    expect(result.current.steps).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch steps successfully', async () => {
    const mockSteps = [
      { id: 1, kind: 'welcome', title: 'Welcome' },
      { id: 2, kind: 'reading-intro', title: 'Reading Introduction' },
    ];

    mockFetchStepsConfig.mockResolvedValue(mockSteps);

    const { result } = renderHook(() => useStepStore());
    
    await act(async () => {
      await result.current.fetchSteps();
    });

    expect(result.current.steps).toEqual(mockSteps);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockFetchStepsConfig).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch steps error', async () => {
    const errorMessage = 'Failed to fetch steps';
    mockFetchStepsConfig.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useStepStore());
    
    await act(async () => {
      await result.current.fetchSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should set loading state during fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockFetchStepsConfig.mockReturnValue(promise);

    const { result } = renderHook(() => useStepStore());
    
    act(() => {
      result.current.fetchSteps();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      resolvePromise!([]);
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle unknown error types', async () => {
    mockFetchStepsConfig.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useStepStore());
    
    await act(async () => {
      await result.current.fetchSteps();
    });

    expect(result.current.error).toBe('An unknown error occurred');
  });
});