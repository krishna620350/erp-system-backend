import { dataFile } from "./fiels.js";

class classController {

    readData = async (req, res) => { 
        try {
            const data = req.body;
            const dataFind = await dataFile.classObject.readData(data);
            if (!dataFind) {
                return res.status(404).json({ message: "class not found." });
            }

            res.status(200).json(dataFind); // Send the data with the same ID as the key
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    insertData = async(req, res) => {
        try{
            const data = req.body;            
            const error = dataFile.validateClassData(data);
            if (!error) {
                const isSuccess = await dataFile.classObject.addData(data);

                if (isSuccess) {
                    res.status(404).json({ message: true });
                } else {
                    res.status(404).json({ message: false });
                }
            } else {
                res.status(404).json(error);
            }
        } catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const classControllerObject = new classController();