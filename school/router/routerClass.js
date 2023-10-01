import { Router } from "express";
import { controller } from "./filesController.js";

const routerClass = new Router();

routerClass.get(`/${controller.collection.class}${controller.router.get}`, controller.classControllerObject.readData);

routerClass.get(`/${controller.collection.class}/all${controller.router.get}`, controller.classControllerObject.readAllData);

routerClass.post(`/${controller.collection.class}${controller.router.post}`, controller.classControllerObject.insertData);

routerClass.delete(`/${controller.collection.class}${controller.router.delete}`, controller.classControllerObject.deleteData);


export { routerClass };