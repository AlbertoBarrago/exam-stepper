import { create } from 'zustand';
import { UserData, UserStore } from '@/types/userTypes';
import { useExamStore } from './examStore';

export const useUserStore = create<
  UserStore & {
    setUser: (userData: UserData) => void;
  }
>((set) => ({
  user: null,
  loading: false,
  error: null,
  logout: () => {
    useExamStore.getState().reset();
    set({ user: null });
  },
  setUser: (userData: UserData) => set({ user: userData }),
}));
