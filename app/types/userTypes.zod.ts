import { z } from 'zod';

export const UserDataSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.email(),
  interceptId: z.string(),
});
