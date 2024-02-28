import { z } from 'zod';

export const UserCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UserAuthenticatedSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['USER', 'ADMIN']),
  }),
});

export const NewUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['USER', 'ADMIN']),
});
