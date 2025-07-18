import { create } from 'zustand';

type UserData = {
    name: string;
    surname: string;
    email: string;
    token: string;
};

interface UserStore {
    user: UserData | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
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
    logout: () => set({ user: null })
}));