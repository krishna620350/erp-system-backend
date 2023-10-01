import { validateBasicTeacherData } from "../models/modelTeacher.js";
import { dataObject } from "../database/dataTeacher.js";
import {data} from "../json/filejson.cjs";
import bcrypt from "bcrypt";


export const fileObject = {
    validateBasicTeacherData,
    dataObject,
    encryption: async (password) => await bcrypt.hash(password, data.numberOfRounds),
}