import { renderHook, act } from '@testing-library/react';
import { useTimerStore } from '../timerStore';
import { SECTION_LIMITS, TOTAL_LIMIT } from '@/constants/timerConst';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TimerStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Clear the store state before each test
    useTimerStore.setState({
      globalTimeLeft: TOTAL_LIMIT,
      sectionTimeLeft: 0,
      currentSection: null,
      isRunning: false,
      isTimeOver: false,
      isSectionTimeOver: false,
      sectionElapsed: {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      },
      currentStepIndex: 0,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimerStore());
    
    expect(result.current.globalTimeLeft).toBe(TOTAL_LIMIT);
    expect(result.current.sectionTimeLeft).toBe(0);
    expect(result.current.currentSection).toBe(null);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isTimeOver).toBe(false);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should start a section correctly', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
    });

    expect(result.current.currentSection).toBe('reading');
    expect(result.current.sectionTimeLeft).toBe(SECTION_LIMITS.reading);
    expect(result.current.isRunning).toBe(true);
  });

  it('should pause the timer', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('should tick and decrease time when running', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
    });

    const initialGlobalTime = result.current.globalTimeLeft;
    const initialSectionTime = result.current.sectionTimeLeft;

    act(() => {
      result.current.tick();
    });

    expect(result.current.globalTimeLeft).toBe(initialGlobalTime - 1);
    expect(result.current.sectionTimeLeft).toBe(initialSectionTime - 1);
  });

  it('should not tick when not running', () => {
    const { result } = renderHook(() => useTimerStore());
    
    const initialGlobalTime = result.current.globalTimeLeft;
    const initialSectionTime = result.current.sectionTimeLeft;

    act(() => {
      result.current.tick();
    });

    // The tick function returns early when not running, so values should remain the same
    expect(result.current.globalTimeLeft).toBe(initialGlobalTime);
    expect(result.current.sectionTimeLeft).toBe(initialSectionTime);
  });

  it('should stop when section time is over', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
    });

    // Set section time to 0 to trigger time over condition
    act(() => {
      useTimerStore.setState({
        sectionTimeLeft: 0,
        currentSection: 'reading',
        isRunning: true,
      });
    });

    act(() => {
      result.current.tick();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isTimeOver).toBe(true);
  });

  it('should navigate between steps', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStepIndex).toBe(2);

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
  });

  it('should not go below step 0', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
      result.current.nextStep();
      result.current.reset();
    });

    expect(result.current.globalTimeLeft).toBe(TOTAL_LIMIT);
    expect(result.current.sectionTimeLeft).toBe(0);
    expect(result.current.currentSection).toBe(null);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isTimeOver).toBe(false);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should track section elapsed time', () => {
    const { result } = renderHook(() => useTimerStore());
    
    act(() => {
      result.current.startSection('reading');
    });

    const initialElapsed = result.current.sectionElapsed.reading;

    act(() => {
      result.current.tick();
    });

    expect(result.current.sectionElapsed.reading).toBe(initialElapsed + 1);
  });
});