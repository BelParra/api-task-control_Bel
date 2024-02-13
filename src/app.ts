import express, { Application, json } from "express";
import helmet from "helmet";
import "reflect-metadata";

export const app: Application = express();

app.use(helmet());

app.use(json());

