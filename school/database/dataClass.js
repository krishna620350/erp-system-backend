import { dataFile } from "./file.js"
import { store } from "./config.js";
import { getDocs, updateDoc, setDoc, doc, collection, query, where, getDoc, arrayUnion } from "firebase/firestore";

class schoolClass {
    constructor() {
        this.classCollection = collection(store, dataFile.class)
        this.schoolCollection = collection(store, dataFile.school)
    }

    readData = async (data) => {
        
        const timestamp = dataFile.timeStamp();
        try {
            const docs = await getDoc(doc(this.classCollection, data.classId));
            if (docs.empty) { 
                dataFile.logFile.writeLog(`${timestamp} - [EMPTY] - class not found for id: ${data.classId} `, dataFile.color.empty);
                return false;
            }
            dataFile.logFile.writeLog(`${timestamp} - [READ] - Read data for id: ${data.classId}`, dataFile.color.read);
            return {id: docs.id, data: docs.data()};
        } catch (e) { 
            console.error("Error reading data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for id: ${data.classId}`, dataFile.color.error);
            return false;
        }
    }

    addData = async (data) => {
        const timestamp = dataFile.timeStamp();
        try {
            const emailQuerySnapshot = await getDocs(
                query(
                    this.classCollection,
                    where("className", "==", data.className),
                    where("sectionName", "==", data.sectionName)
                )
            );

            let docSnapshot, uniqueId;
            if (!emailQuerySnapshot.empty) {
                // Document with this email already exists, do not add data
                dataFile.logFile.writeLog(`${timestamp} - [FOUND] - Class data already present for class name: ${data.className}`, dataFile.color.found);
                return false;
            }
            do {
                uniqueId = dataFile.generateUniqueId(10);
                docSnapshot = await getDoc(doc(this.classCollection, uniqueId)); // Assign the result to docSnapshot
            } while (docSnapshot.exists());

            await setDoc(doc(this.classCollection, uniqueId), data);
            await updateDoc(doc(this.schoolCollection, data.schoolId), {classes: arrayUnion(uniqueId)});
            dataFile.logFile.writeLog(`${timestamp} - [INSERT] - Class Data is inserted for className: ${data.className}`, dataFile.color.write);
            return true;
        } catch (e) {
            console.error("Error adding data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for className: ${data.className}`, dataFile.color.error);
            return false;
        }
    }

    
}

export const classObject = new schoolClass();