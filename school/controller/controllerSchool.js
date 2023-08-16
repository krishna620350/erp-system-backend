
import { dataFile } from "./fiels.js";
import bcrypt from "bcrypt";


class controllerSchool {

    findSchool = async (req, res) => {
        try {
            const data = req.body;
            const dataFind = await dataFile.schoolObject.readData(data);
            if (!dataFind) {
                return res.status(404).json({ message: "School not found." });
            }

            const id = Object.keys(dataFind)[0]; // Get the first (and only) ID
            const comparePassword = await bcrypt.compare(data.password, dataFind[id].password);
            if (!comparePassword) {
                return res.status(401).json({ message: "Invalid credentials." });
            }

            res.status(200).json(dataFind); // Send the data with the same ID as the key
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    };


    registerSchool = async (req, res) => {
        try {
            const data = req.body;
            // console.log(data);
            const error = dataFile.validateSchoolData(data);
            if (!error) {
                const hashedPassword = await bcrypt.hash(data.password, dataFile.saltRound);
                
                data.password = hashedPassword;
                const isSuccess = await dataFile.schoolObject.addData(data);
                
                if (isSuccess.success) {
                    const isEmail = await dataFile.sendMail.sendMails(data.email, isSuccess.code)
                    if (isEmail) {
                        res.status(200).json([{ message: "sign up successful !!!", success: isEmail}]);
                    } else { 
                        res.status(404).json([{ message: "Due to some internal server error sign u[ not successful", success: isEmail }]);
                    }
                } else {
                    res.status(401).json([isSuccess]);
                }
            } else {
                res.status(401).json(error);
            }
            // const datas = req.body;
            // for (const data of datas) {
                //     const error = validateSchoolData(data);
            //     if (!error) {
            //         const hashedPassword = await bcrypt.hash(data.password, dataFile.saltRound);

            //         data.password = hashedPassword;
            //         const isSuccess = await dataFile.schoolObject.addData(data, dataFile.school);

            //         if (isSuccess) {
            //             message[data.email] = true;
            //         } else {
            //             message[data.email] = false;
            //         }
            //     } else {
            //         message[data.email] = { error: error };
            //     }
            // }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    modifySchool = async (req, res) => { 
        try {
            const data = req.body;
            
            const isSuccess = await dataFile.schoolObject.updateData(data);

            if (isSuccess) {
                res.status(404).json({ message: true });
            } else {
                res.status(404).json({ message: false });
            }
        } catch (err) { 
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    deleteSchool = async (req, res) => { 
        try {
            const data = req.body;
            const isSuccess = await dataFile.schoolObject.deleteData(data);

            if (isSuccess) {
                res.status(404).json({ message: true });
            } else {
                res.status(404).json({ message: false });
            }
        } catch (err) { 
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    verifySchool = async (req, res) => { 
        try {
            const data = req.body;
            const isSuccess = await dataFile.sendMail.verifyMail(data.email, data.code);

            if (isSuccess) {
                res.status(404).json({ message: true });
            } else {
                res.status(404).json({ message: false });
            }
        } catch (err) { 
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const schoolControllerObject = new controllerSchool();