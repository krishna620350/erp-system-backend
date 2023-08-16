import { data } from "../json/jsonData.cjs";
import { logFileCreate } from "../logs/log.js";

const logFile = new logFileCreate();
export const dataFile = {
  school: data.collectionName.school,
  class: data.collectionName.class,
  color: data.color,
  logFile: logFile,
  
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
};
// console.log(controller.registration.welcome);
