import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Header from '../layout/Header';
import { useUserStore } from '@/state/userStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/state/userStore', () => ({
  useUserStore: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;

describe('Header Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  it('should render header with logo and navigation', () => {
    mockUseUserStore.mockReturnValue({
      user: {
        id: '1',
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      },
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    expect(screen.getByText(/exam stepper/i)).toBeInTheDocument();
    expect(screen.getByText(/english proficiency test/i)).toBeInTheDocument();
  });

  it('should show user menu when user is logged in', () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should handle logout when logout button is clicked', () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUseUserStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should show login button when user is not logged in', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('should navigate to login when login button is clicked', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    const loginButton = screen.getByText(/login/i);
    fireEvent.click(loginButton);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should navigate to home when logo is clicked', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    const logo = screen.getByText(/exam stepper/i);
    fireEvent.click(logo);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should show register button when user is not logged in', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('should navigate to register when register button is clicked', () => {
    mockUseUserStore.mockReturnValue({
      user: null,
      logout: mockLogout,
    } as any);

    render(<Header />);
    
    const registerButton = screen.getByText(/register/i);
    fireEvent.click(registerButton);
    
    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});