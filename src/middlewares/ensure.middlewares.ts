import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../errors";


class EnsureMiddleware {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public userExists =
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
      const userId = Number(req.body.userId);
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return next();
    };

  public taskExists =
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
      const id = Number(req.params.id);
      const existingTask = await this.prisma.task.findUnique({ where: { id } });

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.locals.task = existingTask;
      return next();
    };

  public isOwnerTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userTokenId = Number(res.locals.userId);
    const task = res.locals.task;

    const user = await this.prisma.user.findUnique({ where: { id: userTokenId } });
    const isAdmin = user && user.role === 'USER';

    if (task.userId !== userTokenId && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    return next();
  };


  public categoryExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Number(req.params.id);
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.locals.category = category;
    next();
  };

  public isOwnerCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(res.locals.userId);
    const category = res.locals.category;

    if (category.userId !== userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };

  public addUserIdToBody = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    req.body.userId = Number(res.locals.userId);
    next();
  };

  public validBody =
    (schema: AnyZodObject) =>
      async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
        try {
          req.body = schema.parse(req.body);

          return next();
        } catch (error) {
          if (error instanceof ZodError) {
            console.log(error.errors);
            return res.status(400).json({ message: "Invalid request body" });
          }
          next(error);
        }
      };
}

const prisma = new PrismaClient();
export const ensure = new EnsureMiddleware(prisma);