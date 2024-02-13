import { z } from 'zod';
import { CategoryCreateSchema, CategoryReturnSchema } from '../schemas';

export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryReturn = z.infer<typeof CategoryReturnSchema>;
