import { create } from 'zustand';
import { UserStore, UserData } from '@/types/user';

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
      const res = await fetch('/api/start', { method: 'POST' });
      const { userData } = await res.json();
      set({ user: userData, loading: false });
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
