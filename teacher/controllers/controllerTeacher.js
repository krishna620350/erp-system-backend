import { fileObject } from "./files.js";

class teacherController {
    readData = (req, res) => {
        res.json({ message: "teacher data" });
    }

    addData = async (req, res) => { 
        try {
            const data = req.body;
            const errors = fileObject.validateBasicTeacherData(data);
            if (!errors) {
                const hashPassword = await fileObject.encryption(data.password);
                data.password = hashPassword;
                const isSuccess = await fileObject.dataObject.insertData(data);
                if (isSuccess) { 
                    res.status(200).json({ message: "data is added" });
                } else {
                    res.status(200).json({ message: "data is not added" })
                }
            } else {
                res.status(203).json(errors);
            }
        } catch (e) { 
            res.status(400).json({ message: "internal server error" });
        }
    }

    updateData = (req, res) => { 

    }

    deleteData = (req, res) => { 
        
    }
}

export const teacherObject = new teacherController();