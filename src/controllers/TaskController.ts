import { Request, Response } from 'express';
import { AppError } from '../errors';
import { TaskService } from '../services';

export class TaskController {
    private taskService: TaskService = new TaskService();

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newTask = await this.taskService.create(req.body);
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
            const category = req.query.category as string | undefined;

            const tasks = await this.taskService.readAll(category);
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
            const { id } = req.params;
            const task = await this.taskService.readOne(parseInt(id));
            if (task) {
                return res.status(200).json(task);
            } else {
                throw new AppError('Task not found', 404);
            }
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.status).json({ message: error.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const taskId = parseInt(id);
            const taskService = new TaskService();
            const updatedTask = await taskService.update(taskId, req.body);
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
            const { id } = req.params;
            const taskId = parseInt(id);
            const taskService = new TaskService();
            await taskService.delete(taskId);
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