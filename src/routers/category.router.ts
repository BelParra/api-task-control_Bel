import { Router } from "express";
import { auth, ensure } from "../middlewares";
import { CategoryCreateSchema } from "../schemas";
import { CategoryController } from "../controllers";

export const categoryRouter = Router();
const controller = new CategoryController();

categoryRouter.post("/",
    auth.isAuthenticated,
    ensure.addUserIdToBody,
    ensure.validBody(CategoryCreateSchema),
    controller.create);

categoryRouter.delete("/:id",
    auth.isAuthenticated,
    ensure.categoryExists,
    ensure.isOwnerCategory,
    controller.delete);
