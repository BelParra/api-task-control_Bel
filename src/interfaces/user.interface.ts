import { z } from 'zod';
import { UserCreateSchema, UserLoginSchema, userReturnSchema } from '../schemas';

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type userReturn = z.infer<typeof userReturnSchema>;