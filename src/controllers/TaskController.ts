import { Request, Response } from 'express';
import { AppError } from '../errors';
import { TaskService } from '../services';
import { prisma } from '../database/prisma';

export class TaskController {
    private taskService: TaskService = new TaskService();

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = Number(res.locals.userId);
            const newTask = await this.taskService.create({ ...req.body, userId });
            return res.status(201).json(newTask);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.status).json({ message: error.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };

    public readAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = Number(res.locals.userId);
            const category = req.query.category as string | undefined;
    
            const tasks = await this.taskService.readAll(userId, category);
            return res.status(200).json(tasks);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.status).json({ message: error.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };

    public readOne = async (req: Request, res: Response): Promise<Response> => {
      try {
        const userId = Number(res.locals.userId);
        const task = await this.taskService.readOne(userId, parseInt(req.params.id));
        return res.status(200).json(task);
      } catch (error) {
        if (error.message === 'Task not found') {
          return res.status(404).json({ message: error.message });
        } else {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        try {
          const userId = Number(res.locals.userId);
          const taskId = parseInt(req.params.id);
      
          const updatedTask = await this.taskService.update(userId, taskId, req.body);
          return res.status(200).json(updatedTask);
        } catch (error) {
          if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
          } else {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
        }
      };
      
      public delete = async (req: Request, res: Response): Promise<void> => {
        try {
          const userId = Number(res.locals.userId);
          const { id } = req.params;
          const taskId = parseInt(id);
      
          const task = await prisma.task.findUnique({ where: { id: taskId } });
      
          const taskService = new TaskService();
          await taskService.delete(userId, taskId);
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