import dotenv from 'dotenv';
dotenv.config({ path: '.env.example' });
import express, { Application, json } from "express";
import helmet from "helmet";
import "reflect-metadata";
import cors from "cors";

import { taskRouter, categoryRouter, userRouter } from "../src/routers/index";
import { handleErrors } from "./middlewares";
export const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/tasks', taskRouter);
app.use('/categories', categoryRouter);
app.use('/users', userRouter);

app.use(handleErrors);
