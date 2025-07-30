import { z } from 'zod';

export const UserDataSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
});
