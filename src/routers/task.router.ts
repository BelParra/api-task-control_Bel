import { Router } from "express";
import { ensure } from "../middlewares";
import { TaskCreateSchema, TaskUpdateSchema } from "../schemas";
import { TaskController } from "../controllers/TaskController";

export const taskRouter = Router();
const controller = new TaskController();
taskRouter.post("/", ensure.validBody(TaskCreateSchema), controller.create);
taskRouter.get("/", controller.readAll);
taskRouter.get("/:id", controller.readOne);
taskRouter.patch("/:id", ensure.taskExists, ensure.validBody(TaskUpdateSchema), controller.update);
taskRouter.delete("/:id", controller.delete);
