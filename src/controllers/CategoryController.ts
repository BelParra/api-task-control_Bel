import { Request, Response } from "express";
import { CategoryService } from "../services";
import { AppError } from "../errors";

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
    const userId = Number(res.locals.userId);
    const { id } = req.params;
    const categoryId = parseInt(id);

    const categoryService = new CategoryService();
    await categoryService.delete(userId, categoryId);
    res.status(204).send();
  };
}

