import express, { Application, json } from "express";
import helmet from "helmet";
import "reflect-metadata";
import { taskRouter, categoryRouter } from "../src/routers/index";
import { handleErrors } from "./middlewares";
export const app: Application = express();

app.use(helmet());

app.use(json());
app.use('/tasks', taskRouter);
app.use('/categories', categoryRouter);
app.use(handleErrors);
