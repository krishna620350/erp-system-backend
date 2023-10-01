import { dataFile } from "./file.js"
import { store } from "./config.js";
import { getDocs, updateDoc, setDoc, doc, collection, query, where, getDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";

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

    readAllData = async(data) => {
        const timestamp = dataFile.timeStamp();
        try {
            const classArray = [];
            const docs = await getDocs(query(this.classCollection), where("schoolId", "==", data.userId));
            if (docs.empty) { 
                dataFile.logFile.writeLog(`${timestamp} - [EMPTY] - class not found for id: ${data.userId} `, dataFile.color.empty);
                return false;
            }
            dataFile.logFile.writeLog(`${timestamp} - [READ] - Read data for id: ${data.userId}`, dataFile.color.read);
            docs.forEach((doc)=>{
                classArray.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            return classArray;
        } catch (e) { 
            console.error("Error reading data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for id: ${data.userId}`, dataFile.color.error);
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
                    where("classSectionName", "==", data.classSectionName)
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

    deleteData = async(data) => {
        const timestamp = dataFile.timeStamp();
        try {
            const docs = await getDoc(doc(this.classCollection, data.id));
            if (docs.empty) { 
                dataFile.logFile.writeLog(`${timestamp} - [EMPTY] - class not found for id: ${data.id} `, dataFile.color.empty);
                return false;
            }
            await deleteDoc(doc(this.classCollection, data.id));
            await updateDoc(doc(this.schoolCollection, data.userId), {
                classes: arrayRemove(data.id)
            });
            dataFile.logFile.writeLog(`${timestamp} - [DELETE] - Read data for id: ${data.classId}`, dataFile.color.read);
            return true;
        } catch (e) { 
            console.error("Error reading data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for id: ${data.classId}`, dataFile.color.error);
            return false;
        }
    }
}

export const classObject = new schoolClass();