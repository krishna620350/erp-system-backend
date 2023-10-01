import express from "express";
import { fileObject } from "./files.js";

const app = express();

app.use(express.json({ limit: '50mb' }));

app.use("/teacher", fileObject.routerTeacher);


export { app };
