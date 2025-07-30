import { z } from 'zod';
import { UserDataSchema } from './userTypes.zod';

export type UserData = z.infer<typeof UserDataSchema>;

export interface UserStore {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}
