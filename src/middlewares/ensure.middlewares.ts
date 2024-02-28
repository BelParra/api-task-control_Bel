import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../errors";


class EnsureMiddleware {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public taskExists =
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
      const id = Number(req.params.id);
      const existingTask = await this.prisma.task.findUnique({ where: { id } });
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return next();
    };

  public userExists =
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
      const userId = Number(req.body.userId);
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return next();
    };

  public isOwnerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userTokenId = Number(res.locals.userId);
    const userId = Number(req.params.userId);

    if (userTokenId !== userId) {
      throw new AppError('User is not authorized to perform this action.', 403);
    }

    return next();
  };


  public addUserIdToBody = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    req.body.userId = Number(res.locals.userId);
    next();
  };

  public validBody =
    (schema: AnyZodObject) =>
      async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
        try {
          console.log("Corpo da requisição antes da validação:", req.body);
          req.body = schema.parse(req.body);
          console.log("Corpo da requisição após a validação:", req.body);

          return next();
        } catch (error) {
          console.log("Corpo da requisição que causou o erro:", req.body);
          if (error instanceof ZodError) {
            console.log("Está ocorrendo um erro no validBody");
            console.log(error.errors);
            return res.status(400).json({ message: "Invalid request body" });
          }
          next(error);
        }
      };
}

const prisma = new PrismaClient();
export const ensure = new EnsureMiddleware(prisma);