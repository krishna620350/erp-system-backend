import data from "../json/data.json" assert {type: "json"};
import { teacherObject } from "../controllers/controllerTeacher.js";

export const fileObject = {
    routers: data.routers,
    teacherObject
}