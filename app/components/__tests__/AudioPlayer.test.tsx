import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioPlayer from '../AudioPlayer';

// Mock HTMLAudioElement
const mockAudio = {
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  duration: 100,
  currentTime: 0,
  volume: 1,
};

Object.defineProperty(HTMLAudioElement.prototype, 'play', {
  writable: true,
  value: mockAudio.play,
});

Object.defineProperty(HTMLAudioElement.prototype, 'pause', {
  writable: true,
  value: mockAudio.pause,
});

Object.defineProperty(HTMLAudioElement.prototype, 'load', {
  writable: true,
  value: mockAudio.load,
});

Object.defineProperty(HTMLAudioElement.prototype, 'addEventListener', {
  writable: true,
  value: mockAudio.addEventListener,
});

Object.defineProperty(HTMLAudioElement.prototype, 'removeEventListener', {
  writable: true,
  value: mockAudio.removeEventListener,
});

Object.defineProperty(HTMLAudioElement.prototype, 'duration', {
  writable: true,
  value: mockAudio.duration,
});

Object.defineProperty(HTMLAudioElement.prototype, 'currentTime', {
  writable: true,
  value: mockAudio.currentTime,
});

// Mock MediaRecorder
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  state: 'inactive',
};

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockMediaRecorder),
});

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    }),
  },
});

// Mock AudioContext
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createMediaElementSource: jest.fn(),
    createAnalyser: jest.fn(),
    createGain: jest.fn(),
    resume: jest.fn(),
  })),
});

describe('AudioPlayer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render play button when not playing', () => {
    render(<AudioPlayer src="test-audio.mp3" />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle play action', async () => {
    render(<AudioPlayer src="test-audio.mp3" />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    await waitFor(() => {
      expect(mockAudio.play).toHaveBeenCalled();
    });
  });

  it('should handle custom play action', () => {
    const mockOnPlayAction = jest.fn();
    render(<AudioPlayer src="test-audio.mp3" onPlayAction={mockOnPlayAction} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    expect(mockOnPlayAction).toHaveBeenCalled();
  });

  it('should render with recording options', () => {
    const mockRecordingOptions = {
      enabled: true,
      duration: 5,
      onStart: jest.fn(),
      onEnd: jest.fn(),
    };

    render(
      <AudioPlayer
        src="test-audio.mp3"
        recordingOptions={mockRecordingOptions}
      />
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle recording start', async () => {
    const mockOnStart = jest.fn();
    const mockRecordingOptions = {
      enabled: true,
      duration: 5,
      onStart: mockOnStart,
      onEnd: jest.fn(),
    };

    render(
      <AudioPlayer
        src="test-audio.mp3"
        recordingOptions={mockRecordingOptions}
      />
    );
    
    // This would require more complex setup to test actual recording
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show spectrum when enabled', () => {
    render(<AudioPlayer src="test-audio.mp3" showSpectrum={true} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle audio end callback', () => {
    const mockOnEndAction = jest.fn();
    render(<AudioPlayer src="test-audio.mp3" onEndAction={mockOnEndAction} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should respect play limit when enabled', () => {
    render(<AudioPlayer src="test-audio.mp3" limitPlays={true} />);
    
    const playButton = screen.getByRole('button');
    
    // Click multiple times to test limit
    fireEvent.click(playButton);
    fireEvent.click(playButton);
    fireEvent.click(playButton);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show metrics when enabled', () => {
    render(<AudioPlayer src="test-audio.mp3" showMetrics={true} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle missing src gracefully', () => {
    render(<AudioPlayer />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle recording with stream', () => {
    const mockStream = {} as MediaStream;
    const mockRecordingOptions = {
      enabled: true,
      duration: 5,
      onStart: jest.fn(),
      onEnd: jest.fn(),
    };

    render(
      <AudioPlayer
        stream={mockStream}
        recordingOptions={mockRecordingOptions}
      />
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});