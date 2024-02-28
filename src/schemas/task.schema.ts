import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
  finished: z.boolean(),
  categoryId: z.number().nullable(),
});

export const TaskCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  categoryId: z.number().optional(),
  userId: z.number(),
});


export const TaskReturnSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
  finished: z.boolean(),
  categoryId: z.number().nullable(),
  category: z.object({
    id: z.number().int(),
    name: z.string()
  }).nullable().optional(),
});

export const TaskUpdateSchema = z.object({
  title: z.string(),
  content: z.string(),
  finished: z.boolean(),
  categoryId: z.number().nullable().optional(),
});