import { fileObject } from "./files.js";
import bcrypt from "bcrypt";
class teacherController {

    addData = async (req, res) => { 
        try {
            const data = req.body;
            const errors = fileObject.validateBasicTeacherData(data);
            if (!errors) {
                data.password = "Teacher@123";
                data.status = false;
                const hashPassword = await fileObject.encryption(data.password);
                data.password = hashPassword;
                const isSuccess = await fileObject.dataObject.insertData(data);
                if (isSuccess) { 
                    res.status(200).json({ message: "data is added", success: true });
                } else {
                    res.status(200).json({ message: "data is not added", success: false })
                }
            } else {
                res.status(203).json(errors);
            }
        } catch (e) { 
            res.status(400).json({ message: "internal server error" });
        }
    }

    findData = async (req, res) => {
        try {
            const data = req.query;
            const dataFind = await fileObject.dataObject.findData(data);
            if (!dataFind) {
                return res.status(403).json({ message: "School not found.", success: false });
            }
            const comparePassword = await bcrypt.compare(data.password, dataFind.data.password);
            if (!comparePassword) {
                return res.status(403).json({ message: "Invalid credentials.", success: false });
            }
            const value = {
                ...dataFind,
                data: { ...dataFind.data, password: null }
            };
            res.status(200).json({ message: value, success: true }); // Send the data with the same ID as the key
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error.", success: false });
        }
    }

    readData = async (req, res) => {
        try {
            const data = req.query;
            const allData = await fileObject.dataObject.readAllData(data);
            if (!allData) {
                return res.status(404).json({ message: "class not found." });
            }
            res.status(200).json(allData); // Send the data with the same ID as the key
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error." });
        };
    }

        

    updateData = async (req, res) => { 
        const data = req.body;
        try{
            const isSuccess = await fileObject.dataObject.updateData(data);
        }catch (e) {
            res.status(400).json({ message: "internal server error" });
        }
    }

    deleteData = (req, res) => { 
        
    }
}

export const teacherObject = new teacherController();