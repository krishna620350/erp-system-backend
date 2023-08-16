import { Router } from "express";
import { fileObject } from "./files.js";

const routerTeacher = new Router();

routerTeacher.get(fileObject.routers.get, fileObject.teacherObject.readData);

routerTeacher.post(fileObject.routers.post, fileObject.teacherObject.addData);

routerTeacher.put(fileObject.routers.update, fileObject.teacherObject.updateData);

routerTeacher.delete(fileObject.routers.delete, fileObject.teacherObject.deleteData);


export { routerTeacher };