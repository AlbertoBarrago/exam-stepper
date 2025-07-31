import { z } from 'zod';

export const UserDataSchema = z.object({
  id: z.uuid(),
  aud: z.string(),
  role: z.string(),
  email: z.email(),
  phone: z.string(),
  confirmation_sent_at: z.iso.datetime(),
  app_metadata: z.object({
    provider: z.string(),
    providers: z.array(z.string()),
  }),
  user_metadata: z.object({
    display_name: z.string(),
    email: z.email(),
    email_verified: z.boolean(),
    phone_verified: z.boolean(),
    sub: z.string(),
  }),
  identities: z.array(
    z.object({
      identity_id: z.string(),
      id: z.string(),
      user_id: z.string(),
      identity_data: z.object({
        display_name: z.string(),
        email: z.email(),
        email_verified: z.boolean(),
        phone_verified: z.boolean(),
        sub: z.string(),
      }),
      provider: z.string(),
      last_sign_in_at: z.iso.datetime(),
      created_at: z.iso.datetime(),
      updated_at: z.iso.datetime(),
      email: z.email(),
    })
  ),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  is_anonymous: z.boolean(),
});
