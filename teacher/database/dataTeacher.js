import { fileObject } from "./files.js";
import { store } from "./config.js";
import { getDoc, getDocs, setDoc, doc, collection, query, where } from "firebase/firestore";

class dataTeacher {
    constructor() {
        this.teachCollection = collection(store, fileObject.teacher);
    }
    
    insertData = async (data) => {
        const timestamp = fileObject.timeStamp();
        try {
            const emailQuerySnapshot = await getDocs(query(this.teachCollection, where("email", "==", data.email)));
            let docSnapshot, uniqueId;
            if (!emailQuerySnapshot.empty) {
                // Document with this email already exists, do not add data
                fileObject.log.writeLog(`${timestamp} - [FOUND] - Teacher data already present for email: ${data.email}`, fileObject.color.found);
                return false;
            }
            do {
                uniqueId = fileObject.generateUniqueId(10);
                docSnapshot = await getDoc(doc(this.teachCollection, uniqueId)); // Assign the result to docSnapshot
            } while (docSnapshot.exists());

            await setDoc(doc(this.teachCollection, uniqueId), data);
            fileObject.log.writeLog(`${timestamp} - [INSERT] - Teacher Data is inserted for email: ${data.email}`, fileObject.color.write);
            return true;
        } catch (e) {
            console.error("Error adding data:", e);
            fileObject.log.writeLog(`${timestamp} - [ERROR] - Error detected for email: ${data.email}`, fileObject.color.error);
            return false;
        }
    }
}

export const dataObject = new dataTeacher();