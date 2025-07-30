import { z } from 'zod';

export const UserDataSchema = z.object({
  username: z.string(),
  surname: z.string(),
  email: z.email(),
});
