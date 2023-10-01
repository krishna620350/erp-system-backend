import {data} from "../json/filejson.cjs";
import {log} from "../logs/log.js";

export const fileObject = {
    teacher: data.collection.teacher,
    log,
    color: data.color,
    timeStamp: () => {
        const utcString = new Date().toISOString();
        const istOptions = {
            timeZone: "Asia/Kolkata",
            timeZoneName: "short",
            hour12: false,
        };
        return new Date(utcString).toLocaleString('en-IN', istOptions);
    },
    generateUniqueId: (length) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}