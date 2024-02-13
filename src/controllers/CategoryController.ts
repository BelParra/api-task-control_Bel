import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { AppError } from "../errors";

export class CategoryController {
  private categoryService: CategoryService = new CategoryService();

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
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
      const { id } = req.params;
      const categoryId = parseInt(id);
      const categoryService = new CategoryService();
      await categoryService.delete(categoryId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.status).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
}    
