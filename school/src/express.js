import express from "express";
import { paths } from "./filesRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/school", paths.school);
app.use("/school", paths.routerClass)

export { app };