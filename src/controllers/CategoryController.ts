import { Request, Response } from "express";
import { CategoryService } from "../services";
import { AppError } from "../errors";
import { prisma } from "../database/prisma";

export class CategoryController {
  private categoryService: CategoryService = new CategoryService();

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = Number(res.locals.userId);
      req.body.userId = userId;
      const newCategory = await this.categoryService.create(req.body);
      return res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(res.locals.userId);
      const { id } = req.params;
      const categoryId = parseInt(id);
  
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
  
      if (category.userId !== userId) {
        throw new AppError('Forbidden', 403);
      }
  
      const categoryService = new CategoryService();
      await categoryService.delete(userId, categoryId);
      res.status(204).send();
    } catch (error) {
      console.log("Erro ao deletar a categoria:", error);
      if (error.message === 'Category not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Forbidden') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
    
  
  
  
}

