import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Login from '../Login';
import { useUserStore } from '@/state/userStore';
import { login } from '@/services/api';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/state/userStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  login: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
const mockLogin = login as jest.MockedFunction<typeof login>;

describe('Login Component', () => {
  const mockPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseUserStore.mockReturnValue({
      setUser: mockSetUser,
      user: null,
      loading: false,
      error: null,
    } as any);
  });

  it('should render login form correctly', () => {
    render(<Login />);
    
    expect(screen.getAllByDisplayValue('')).toHaveLength(2); // Email and password inputs
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<Login />);
    
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs[0]; // First input (email)
    const passwordInput = inputs[1]; // Second input (password)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockLogin.mockResolvedValueOnce({
      success: true,
      user: mockUser,
    });

    render(<Login />);
    
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs[0]; // First input (email)
    const passwordInput = inputs[1]; // Second input (password)
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockPush).toHaveBeenCalledWith('/exam/start');
    });
  });

  it('should handle login failure', async () => {
    mockLogin.mockResolvedValueOnce({
      success: false,
      error: 'Invalid credentials',
    });

    render(<Login />);
    
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs[0]; // First input (email)
    const passwordInput = inputs[1]; // Second input (password)
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should handle network error', async () => {
    mockLogin.mockResolvedValueOnce({
      success: false,
      error: 'Network error',
    });

    render(<Login />);
    
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs[0]; // First input (email)
    const passwordInput = inputs[1]; // Second input (password)
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockLogin.mockReturnValueOnce(promise);

    render(<Login />);
    
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs[0]; // First input (email)
    const passwordInput = inputs[1]; // Second input (password)
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    
    await act(async () => {
      resolvePromise!({ success: true, user: {} });
      await promise;
    });
  });

  it('should navigate to register page', () => {
    render(<Login />);
    
    const registerLink = screen.getByText(/register/i);
    fireEvent.click(registerLink);
    
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('should validate required fields', async () => {
    render(<Login />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});