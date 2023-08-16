import express from "express";
import { fileObject } from "./files.js";

const app = express();

app.use(express.json());

app.use("/teacher", fileObject.routerTeacher);


export { app };
