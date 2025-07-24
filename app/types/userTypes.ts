export type UserData = {
  name: string;
  surname: string;
  email: string;
  interceptId: string;
};

export interface UserStore {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}
