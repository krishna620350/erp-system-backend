import { fileObject } from "./files.js";
import { store, storage, database } from "./config.js";
import { getDoc, getDocs, setDoc, doc, collection, query, where, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref as storageRef, getDownloadURL } from "firebase/storage";
import { set, ref as dataBaseref} from "firebase/database";

class dataTeacher {
    constructor() {
        this.teacherCollection = collection(store, fileObject.teacher);
    }

    findData = async (data) => {
        const timestamp = fileObject.timeStamp();
        try {
            let dataFind = {
                id: '',
                data: ''
            };
            const docs = await getDocs(query(this.teacherCollection, where("email", "==", data.email)));
            if (docs.empty) { 
                fileObject.log.writeLog(`${timestamp} - [EMPTY] - School not found for email: ${data.email} `, fileObject.color.empty);
                return false;
            }
            docs.forEach((doc)=>{
                dataFind.id = doc.id;
                dataFind.data = doc.data();
            })
            await set(dataBaseref(database, `${fileObject.teacher}Login/${dataFind.id}`), {
                email: dataFind.data.email,
                timestamp: {
                    startAt: timestamp,
                    endAt: "00:00:00"
                }
            });
            fileObject.log.writeLog(`${timestamp} - [READ] - Read data for email: ${data.email}`, fileObject.color.read);
            return dataFind;
        } catch (e) { 
            console.error("Error reading data:", e);
            fileObject.log.writeLog(`${timestamp} - [ERROR] - Error detected for email: ${data.email}`, fileObject.color.error);
            return false;
        }
    }

    readAllData  = async(data) => {
        const timestamp = fileObject.timeStamp();
        try {
            const classArray = [];
            const docs = await getDocs(query(this.teacherCollection), where("schoolId", "==", data.userId));
            if (docs.empty) { 
                fileObject.log.writeLog(`${timestamp} - [EMPTY] - class not found for id: ${data.userId} `, fileObject.color.empty);
                return false;
            }
            fileObject.log.writeLog(`${timestamp} - [READ] - Read data for id: ${data.userId}`, fileObject.color.read);
            docs.forEach((doc)=>{
                classArray.push({
                    id: doc.id,
                    img: doc.data().photoUrl || "",
                    "full name": doc.data().name,
                    "date of birth": doc.data().dateOfBirth,
                    "email id": doc.data().email,
                    "phone number": doc.data().phoneNumber,
                    gender: doc.data().gender,
                    status: doc.data().status
                })
            })
            return classArray;
        } catch (e) { 
            console.error("Error reading data:", e);
            fileObject.log.writeLog(`${timestamp} - [ERROR] - Error detected for id: ${data.userId}`, fileObject.color.error);
            return false;
        }
    }

    insertData = async (data) => {
        const timestamp = fileObject.timeStamp();
        try {
            const emailQuerySnapshot = await getDocs(query(this.teacherCollection, where("emailId", "==", data.emailId)));
            let docSnapshot, uniqueId;
            if (!emailQuerySnapshot.empty) {
                fileObject.log.writeLog(`${timestamp} - [FOUND] - Teacher data already present for email: ${data.emailId}`, fileObject.color.found);
                return false;
            }
            do {
                uniqueId = fileObject.generateUniqueId(10);
                docSnapshot = await getDoc(doc(this.teacherCollection, uniqueId)); // Assign the result to docSnapshot
            } while (docSnapshot.exists());

            await setDoc(doc(this.teacherCollection, uniqueId), data);
            fileObject.log.writeLog(`${timestamp} - [INSERT] - Teacher Data is inserted for email: ${data.emailId}`, fileObject.color.write);
            return true;
        } catch (e) {
            console.error("Error adding data:", e);
            fileObject.log.writeLog(`${timestamp} - [ERROR] - Error detected for email: ${data.emailId}`, fileObject.color.error);
            return false;
        }
    }

    updateData = async (data) => {
        const timestamp = fileObject.timeStamp();
        try {
            const fileBuffer = Buffer.from(data.fileData, 'base64');
        
            const metadata = {
                contentType: 'image/jpeg/jpg',
            };
        
            const storageRef = storageRef(storage, `teachers/${data.teacherId}/${data.fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);
            
            fileObject.log.writeLog(`${timestamp} - [INSERT] - image is uploaded for id: ${data.teacherId}`, fileObject.color.write);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    if (error) {
                        console.error("Error uploading file:", error);
                    } else {
                        console.error("Error uploading file: No additional error information available.");
                    }
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await updateDoc(doc(this.teacherCollection, data.teacherId), {
                            photoUrl: downloadURL,
                        });
                        fileObject.log.writeLog(`${timestamp} - [UPDATED] - Teacher data is updated for id: ${data.teacherId}`, fileObject.color.update);
                    } catch (error) {
                        fileObject.log.writeLog(`${timestamp} - [ERROR] - Error updating data for id: ${data.teacherId}`, fileObject.color.error);
                    }
                },
            );
        
            return true;
        } catch (e) {
            console.error('Error uploading file:', e);
            fileObject.log.writeLog(`${timestamp} - [ERROR] - Error uploading file for id: ${data.teacherId}`, fileObject.color.error);
            return false;
        }
    };
}

export const dataObject = new dataTeacher();