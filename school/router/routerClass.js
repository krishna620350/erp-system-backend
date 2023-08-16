import { Router } from "express";
import { controller } from "./filesController.js";

const routerClass = new Router();

routerClass.get(`/${controller.collection.class}${controller.router.get}`, controller.classControllerObject.readData);

routerClass.post(`/${controller.collection.class}${controller.router.post}`, controller.classControllerObject.insertData);

export { routerClass };