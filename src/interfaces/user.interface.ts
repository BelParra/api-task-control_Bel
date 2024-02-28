import { z } from 'zod';
import {
    UserCreateSchema,
    UserLoginSchema,
    UserAuthenticatedSchema,
    NewUserSchema
} from '../schemas';

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserReturn = z.infer<typeof UserAuthenticatedSchema>;
export type UserAuth = z.infer<typeof NewUserSchema>;