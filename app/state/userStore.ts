import { create } from 'zustand';
import { UserData, UserStore } from '@/types/userTypes';
import { login } from '@/services/apiService';

export const useUserStore = create<
  UserStore & {
    setUser: (userData: UserData) => void;
  }
>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await login('testuser', 'password');
      if (response.success) {
        set({ user: response.user, loading: false });
      } else {
        set({ error: response.error || 'Login failed', loading: false });
      }
    } catch (err) {
      let message = 'Failed to fetch user';
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
  logout: () => set({ user: null }),
  setUser: (userData: UserData) => set({ user: userData }),
}));
