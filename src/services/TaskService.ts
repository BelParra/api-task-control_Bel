import { PrismaClient } from "@prisma/client";
import { TaskCreate, TaskReturn, TaskUpdate } from "../interfaces";
import { TaskCreateSchema, TaskReturnSchema } from "../schemas";
import { AppError } from "../errors";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export class TaskService {
  public create = async (taskData: TaskCreate): Promise<TaskReturn> => {
    try {
      const validatedTaskData = TaskCreateSchema.parse(taskData);
      if (validatedTaskData.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: validatedTaskData.categoryId },
        });

        if (!category) {
          throw new AppError("Category not found", 404);
        }
      }

      const newTask = await prisma.task.create({
        data: {
          title: validatedTaskData.title,
          content: validatedTaskData.content,
          categoryId: validatedTaskData.categoryId || null,
          userId: validatedTaskData.userId,
        },
      });

      return newTask;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError("Invalid request body", 400);
      }
      throw error;
    }
  };

  public readAll = async (userId: number, categoryName: string | undefined): Promise<TaskReturn[]> => {
    try {
      let tasks: TaskReturn[];
      if (categoryName) {
        const category = await prisma.category.findFirst({
          where: { name: categoryName, userId },
        });

        if (!category) {
          throw new AppError('Category not found', 404);
        }

        tasks = await prisma.task.findMany({
          where: { categoryId: category.id, userId },
          include: { category: true }
        });
      } else {
        tasks = await prisma.task.findMany({ where: { userId }, include: { category: true } });
      }

      return tasks;
    } catch (error) {
      throw error;
    }
  };

  public readOne = async (userId: number, taskId: number): Promise<TaskReturn | null> => {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      },
      include: { category: true }
    });

    if (!task) {
      throw new AppError('Task not found');
    }

    return TaskReturnSchema.parse(task);
  };

  public update = async (userId: number, id: number, data: TaskUpdate | null): Promise<TaskReturn> => {
    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        throw new AppError('Task not found', 404);
      }

      if (task.userId !== userId) {
        throw new AppError('Forbidden', 403);
      }

      if (!data) {
        throw new AppError('Invalid data', 400);
      }

      if (data.categoryId) {
        const existingCategory = await prisma.category.findUnique({
          where: { id: data.categoryId },
        });
        if (!existingCategory) {
          throw new AppError('Category not found', 404);
        }
      }

      const updatedTask = await prisma.task.update({ where: { id, userId }, data });
      return TaskReturnSchema.parse(updatedTask);
    } catch (error) {
      throw error;
    }
  };

  public delete = async (userId: number, id: number): Promise<void> => {
    try {
      const existingTask = await prisma.task.findUnique({
        where: { id, userId },
      });

      if (!existingTask) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.task.delete({
        where: { id, userId },
      });
    } catch (error) {
      throw error;
    }
  };
}