import { z } from "zod";
import { TaskSchema } from "../schemas";

export const CategorySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    tasks: z.array(TaskSchema),
});

export const CategoryCreateSchema = z.object({
    name: z.string(),
    userId: z.number(),
});

export const CategoryReturnSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    tasks: z.array(TaskSchema),
});