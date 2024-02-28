import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../errors";
import { CategoryCreate } from "../interfaces";
import { CategoryCreateSchema } from "../schemas";

export class CategoryService {

    public create = async (categoryData: CategoryCreate): Promise<{ id: number; name: string; }> => {
        try {

            const validData = CategoryCreateSchema.parse(categoryData);
            if (!validData.name) {
                throw new AppError('Invalid data: Missing name', 400);
            }
            const newCategory = await prisma.category.create({
                data: {
                    name: validData.name,
                    userId: validData.userId,
                },
            });

            return newCategory;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new AppError('Invalid data: Missing body parameter', 400);
            }
            throw new AppError('Internal Server Error', 500);
        }
    };

    public delete = async (userId: number, id: number): Promise<void> => {
        await prisma.category.delete({ where: { id, userId } });
    };
}
