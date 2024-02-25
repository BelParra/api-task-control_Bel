import { Router } from "express";
import { ensure } from "../middlewares";
import { UserCreateSchema, UserLoginSchema } from "../schemas";
import { UserController } from "../controllers/UserController";

export const userRouter = Router();
const controller = new UserController();

userRouter.post("/", ensure.validBody(UserCreateSchema), controller.create);
userRouter.post("/login", ensure.validBody(UserLoginSchema), controller.login);

