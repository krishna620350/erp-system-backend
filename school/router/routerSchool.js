import { Router } from "express";
import { controller } from "./filesController.js";

const router = new Router();

router.get(controller.router.get, controller.schoolControllerObject.findSchool);

router.post(controller.router.post, controller.schoolControllerObject.registerSchool);

router.put(controller.router.put, controller.schoolControllerObject.modifySchool);

router.delete(controller.router.delete, controller.schoolControllerObject.deleteSchool);

router.post(controller.router.verify, controller.schoolControllerObject.verifySchool)
// console.log(controller)
export { router };