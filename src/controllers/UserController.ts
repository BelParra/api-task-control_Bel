import { Request, Response } from 'express';
import { UserService } from '../services';
import { UserCreate } from '../interfaces';
import { UserCreateSchema } from '../schemas';
import { z } from 'zod';
import { AppError } from '../errors';


export class UserController {
    private userService: UserService = new UserService();

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userData: UserCreate = req.body;
            console.log("Dados do usuário recebidos no controller:", userData);
            const validData = UserCreateSchema.parse(userData);
            const newUser = await this.userService.create(validData);
            return res.status(201).json(newUser);
        } catch (error) {
            if (error.message === 'This email is already registered') {
                return res.status(409).json({ message: error.message });
            } else if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Invalid request body' });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };

    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { accessToken, user } = await this.userService.login(req.body);
            return res.status(200).json({ accessToken, user });
        } catch (error) {
            console.error(error);

            if (error instanceof z.ZodError) {
                return res.status(409).json({ message: 'Invalid request body' });
            } else if (error.message === 'User not exists') {
                return res.status(404).json({ message: error.message });
            } else if (error.message === "Email and password doesn't match") {
                return res.status(401).json({ message: error.message });
            } else {
                return res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        };
    };

    public getProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = Number(res.locals.userId);
            if (!userId) {
                throw new AppError("User ID not found", 400);
            }
            const userProfile = await this.userService.getProfile(userId);
            return res.status(200).json(userProfile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json({ message: 'Error fetching user profile' });
        }
    };

}