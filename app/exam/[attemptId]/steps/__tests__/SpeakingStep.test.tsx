import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpeakingStep from '../Speaking/SpeakingStep';

// Mock AudioPlayer component
jest.mock('@/components/AudioPlayer', () => {
  return function MockAudioPlayer({ onEndAction, recordingOptions }: any) {
    return (
      <div data-testid="audio-player">
        <button onClick={onEndAction}>End Audio</button>
        {recordingOptions?.enabled && (
          <button onClick={recordingOptions.onStart}>Start Recording</button>
        )}
      </div>
    );
  };
});

describe('SpeakingStep Component', () => {
  const mockOnNextAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render speaking step with audio player', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });

  it('should handle audio end action', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    // Should show recording interface
    expect(screen.getByText(/start recording/i)).toBeInTheDocument();
  });

  it('should start recording when start recording button is clicked', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // First end the audio
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    // Then start recording
    const startRecordingButton = screen.getByText('Start Recording');
    fireEvent.click(startRecordingButton);
    
    // Should show recording state
    expect(screen.getByText(/recording/i)).toBeInTheDocument();
  });

  it('should show recording duration', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // End audio to show recording interface
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    expect(screen.getByText(/5 seconds/i)).toBeInTheDocument();
  });

  it('should handle different recording durations', () => {
    const props = {
      recDurationMs: 10000, // 10 seconds
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // End audio to show recording interface
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    expect(screen.getByText(/10 seconds/i)).toBeInTheDocument();
  });

  it('should show retry button after recording', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // End audio to show recording interface
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    // Start recording
    const startRecordingButton = screen.getByText('Start Recording');
    fireEvent.click(startRecordingButton);
    
    // Should show retry and next buttons
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('should call onNextAction when next button is clicked', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // End audio to show recording interface
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    // Start recording
    const startRecordingButton = screen.getByText('Start Recording');
    fireEvent.click(startRecordingButton);
    
    // Click next
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    expect(mockOnNextAction).toHaveBeenCalledTimes(1);
  });

  it('should reset recording when retry button is clicked', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // End audio to show recording interface
    const endAudioButton = screen.getByText('End Audio');
    fireEvent.click(endAudioButton);
    
    // Start recording
    const startRecordingButton = screen.getByText('Start Recording');
    fireEvent.click(startRecordingButton);
    
    // Click retry
    const retryButton = screen.getByText(/retry/i);
    fireEvent.click(retryButton);
    
    // Should show recording interface again
    expect(screen.getByText(/start recording/i)).toBeInTheDocument();
  });

  it('should handle missing audioFileUrl', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: '',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    // Should still render the component
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });

  it('should show practice question text', () => {
    const props = {
      recDurationMs: 5000,
      audioFileUrl: 'test-audio.mp3',
      onNextAction: mockOnNextAction,
    };

    render(<SpeakingStep {...props} />);
    
    expect(screen.getByText(/practice question/i)).toBeInTheDocument();
  });
});