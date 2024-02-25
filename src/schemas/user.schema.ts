import { z } from 'zod';

export const UserCreateSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const UserLoginSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
})

export const userReturnSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
});

