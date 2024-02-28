import { Router } from "express";
import { auth, ensure} from "../middlewares";
import { TaskCreateSchema, TaskUpdateSchema } from "../schemas";
import { TaskController } from "../controllers";

export const taskRouter = Router();
const controller = new TaskController();

taskRouter.post("/",
    auth.isAuthenticated,
    ensure.addUserIdToBody,
    ensure.validBody(TaskCreateSchema),
    controller.create
);

taskRouter.get("/",
    auth.isAuthenticated,
    controller.readAll
);

taskRouter.get("/:id",
    auth.isAuthenticated,
    controller.readOne
);

taskRouter.patch("/:id",
    auth.isAuthenticated,
    //ensure.isOwnerUser,
    ensure.taskExists,
    ensure.validBody(TaskUpdateSchema),
    controller.update
);

taskRouter.delete("/:id",
    auth.isAuthenticated,
    //ensure.isOwnerUser,
    controller.delete
);
