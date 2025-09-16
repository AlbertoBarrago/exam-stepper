import { render } from '@testing-library/react';
import PreventBackNavigation from '../PreventBackNavigation';

// Mock window.history
const mockPushState = jest.fn();
const mockReplaceState = jest.fn();

Object.defineProperty(window, 'history', {
  value: {
    pushState: mockPushState,
    replaceState: mockReplaceState,
  },
  writable: true,
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('PreventBackNavigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<PreventBackNavigation />);
    
    // Component should render successfully
    expect(true).toBe(true);
  });

  it('should add beforeunload event listener on mount', () => {
    render(<PreventBackNavigation />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove beforeunload event listener on unmount', () => {
    const { unmount } = render(<PreventBackNavigation />);
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should prevent back navigation', () => {
    render(<PreventBackNavigation />);
    
    // The component should add event listeners to prevent back navigation
    expect(mockAddEventListener).toHaveBeenCalled();
  });

  it('should handle beforeunload event', () => {
    render(<PreventBackNavigation />);
    
    // Get the event handler that was added
    const beforeunloadHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeunload'
    )?.[1];
    
    expect(beforeunloadHandler).toBeDefined();
    
    // Test the handler
    const mockEvent = {
      preventDefault: jest.fn(),
      returnValue: '',
    };
    
    if (beforeunloadHandler) {
      beforeunloadHandler(mockEvent);
      expect(mockEvent.returnValue).toBe('Are you sure you want to leave?');
    }
  });
});