import { store, database } from "./config.js";
import { doc, setDoc, getDocs, getDoc, collection, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { set,ref } from "firebase/database";
import { dataFile } from "./file.js";

class dataSchool {
    constructor() {
        this.schoolCollectionRef = collection(store, dataFile.school);
    }

    readData = async (data) => {
        const timestamp = dataFile.timeStamp();
        try {
            let dataFind = {};
            const docs = await getDocs(query(this.schoolCollectionRef, where("email", "==", data.email)));
            if (docs.empty) { 
                dataFile.logFile.writeLog(`${timestamp} - [EMPTY] - School not found for email: ${data.email} `, dataFile.color.empty);
                return false;
            }
            docs.forEach(doc => {
                dataFind[doc.id] = doc.data();
            });
            set(ref(database, `${dataFile.school}Login/${Object.keys(dataFind)[0]}`), {
                email: dataFind[Object.keys(dataFind)[0]].email,
                timestamp: {
                    startAt: timestamp,
                    endAt: "00:00:00"
                }
            });
            dataFile.logFile.writeLog(`${timestamp} - [READ] - Read data for email: ${data.email}`, dataFile.color.read);
            return dataFind;
        } catch (e) { 
            console.error("Error reading data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for email: ${data.email}`, dataFile.color.error);
            return false;
        }
    }

    addData = async (data) => {
        const timestamp = dataFile.timeStamp();
        try {
            const emailQuerySnapshot = await getDocs(query(this.schoolCollectionRef, where("email", "==", data.email)));
            let docSnapshot, uniqueId;
            if (!emailQuerySnapshot.empty) {
                // Document with this email already exists, do not add data
                dataFile.logFile.writeLog(`${timestamp} - [FOUND] - School data already present for email: ${data.email}`, dataFile.color.found);
                return {success: false, message: "email Id already present"};
            }
            do {
                uniqueId = dataFile.generateUniqueId(10);
                docSnapshot = await getDoc(doc(this.schoolCollectionRef, uniqueId)); // Assign the result to docSnapshot
            } while (docSnapshot.exists());
            data.activity = {
                code: dataFile.generateUniqueId(6),
                status: false
            }
            await setDoc(doc(this.schoolCollectionRef, uniqueId), data);
            dataFile.logFile.writeLog(`${timestamp} - [INSERT] - School Data is inserted for email: ${data.email}`, dataFile.color.write);
            return {success: true, code: data.activity.code};
        } catch (e) {
            console.error("Error adding data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error detected for email: ${data.email}`, dataFile.color.error);
            return { success: false, message: "Error detected for provided email." };
        }
    };

    updateData = async (data) => {
        const timestamp = dataFile.timeStamp();
        try {
            await updateDoc(doc(this.schoolCollectionRef, data.id), data.value);
            dataFile.logFile.writeLog(`${timestamp} - [UPDATE] - School Data is updated for id: ${data.id}`, dataFile.color.update);
            return true;
        } catch (e) {
            console.error("Error updating data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error updating data for id: ${data.id}`, dataFile.color.error);
            return false;
        }
    }

    deleteData = async (data) => {
        const timestamp = dataFile.timeStamp();
        try {
            const docRef = doc(this.schoolCollectionRef, data.id);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                await deleteDoc(docRef);
                dataFile.logFile.writeLog(`${timestamp} - [DELETE] - School Data is deleted for id: ${data.id}`, dataFile.color.delete);
                return true;
            } else {
                dataFile.logFile.writeLog(`${timestamp} - [EMPTY] - School Data not found for id: ${data.id}`, dataFile.color.empty);
                return false;
            }
        } catch (e) {
            console.error("Error deleting data:", e);
            dataFile.logFile.writeLog(`${timestamp} - [ERROR] - Error deleting data for id: ${data.id}`, dataFile.color.error);
            return false;
        } finally {
            dataFile.logFile.close();
        }
    }
}


export const schoolObject = new dataSchool();
