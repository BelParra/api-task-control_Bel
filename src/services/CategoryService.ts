import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../errors";
import { CategoryCreate} from "../interfaces";
import { CategoryCreateSchema } from "../schemas";

export class CategoryService {

    public async create(categoryData: CategoryCreate): Promise<{ id: number; name: string; }> {
        try {
            const validData = CategoryCreateSchema.parse(categoryData);
    
            if (!validData.name) {
                throw new AppError('Invalid data: Missing name', 400);
            }
    
            const newCategory = await prisma.category.create({
                data: { name: validData.name },
            });
    
            return newCategory;
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                throw new AppError('Invalid data: Missing body parameter', 400);
            }
            throw new AppError('Internal Server Error', 500);
        }
    }
    
    


    public delete = async (id: number): Promise<void> => {
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        await prisma.category.delete({ where: { id } });
    };

}
