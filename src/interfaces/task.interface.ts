import { z } from 'zod';
import { TaskCreateSchema, TaskReturnSchema, TaskUpdateSchema } from '../schemas';

export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type TaskReturn = z.infer<typeof TaskReturnSchema>;
