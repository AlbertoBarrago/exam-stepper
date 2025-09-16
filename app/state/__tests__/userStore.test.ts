import { renderHook, act } from '@testing-library/react';
import { useUserStore } from '../userStore';

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

describe('UserStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserStore());
    
    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should set user correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    const mockUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should logout and clear user data', () => {
    const { result } = renderHook(() => useUserStore());
    
    const mockUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBe(null);
  });

  it('should update user data', () => {
    const { result } = renderHook(() => useUserStore());
    
    const initialUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const updatedUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Updated Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(initialUser);
    });

    act(() => {
      result.current.setUser(updatedUser);
    });

    expect(result.current.user).toEqual(updatedUser);
  });
});