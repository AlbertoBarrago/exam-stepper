import { z } from 'zod';
import { UserDataSchema } from '@/types/zodValidation/userTypes.zod';

export type UserData = z.infer<typeof UserDataSchema>;

export interface UserStore {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
}
