import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";


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

  public validBody =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
      try {
        req.body = schema.parse(req.body);
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid request body" });
        }
        next(error); 
      }
    };
}

const prisma = new PrismaClient();
export const ensure = new EnsureMiddleware(prisma);