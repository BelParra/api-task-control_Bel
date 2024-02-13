import { Router } from "express";
import { ensure } from "../middlewares";
import { CategoryCreateSchema } from "../schemas";
import { CategoryController } from "../controllers/CategoryController";

export const categoryRouter = Router();
const controller = new CategoryController();
categoryRouter.post("/", ensure.validBody(CategoryCreateSchema), controller.create);
categoryRouter.delete("/:id", controller.delete);
