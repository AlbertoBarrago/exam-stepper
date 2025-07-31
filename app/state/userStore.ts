import { create } from 'zustand';
import { UserData, UserStore } from '@/types/userTypes';

export const useUserStore = create<
  UserStore & {
    setUser: (userData: UserData) => void;
  }
>((set) => ({
  user: null,
  loading: false,
  error: null,
  logout: () => set({ user: null }),
  setUser: (userData: UserData) => set({ user: userData }),
}));
