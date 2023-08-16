import nodemailer from "nodemailer"
import { dataFile } from "./file.js";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
// Create a transporter using the default SMTP transport
class smtpEmail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "erp.system.domain@gmail.com",
                pass: "vfadjvmxrupuggtu",
            },
        });

        this.schoolConfiguration = collection(dataFile.store, dataFile.school);
    }

    sendMails = async (email, code) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: "erp.system.domain@gmail.com",
                to: email,
                subject: "verify your email",
                html: `
                    <div style="border: 2px solid #808080; padding: 20px; text-align: center;">
                        <h1 style="border-bottom: 1px solid #808080;padding: 10px;">Verify Your Account</h1>
                        <p><strong>Hello,</strong></p>
                        <p>Your verification code is: <h3><strong>${code}</strong></h3></p>
                        <p>This code will expire in 24 hours.</p>
                        <p>Thank you for using our service.</p>
                        <p><em>Best regards,</em></p>
                        <p>ERP#</p>
                        <p>Contact: erp.system.domain@gmail.com</p>
                    </div>
                `,
            };

            // Send the email
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    resolve(false); // Resolve the Promise with false on error
                } else {
                    console.log("Email sent:", info.response);
                    resolve(true); // Resolve the Promise with true on success
                }
            });
        });
    }

    
    verifyMail = async (email, code) => {
        try {
            const emailQuerySnapshot = await getDocs(query(this.schoolConfiguration, where("email", "==", email), where("activity.code", "==", code)));

            if (!emailQuerySnapshot.empty) {
                const updatePromises = emailQuerySnapshot.docs.map(async (queryDocSnapshot) => {
                    const docRef = doc(this.schoolConfiguration, queryDocSnapshot.id);
                    await updateDoc(docRef, { "activity.status": true });
                });

                await Promise.all(updatePromises); // Wait for all updates to finish
                return true;
            } else {
                console.log("No document found with the email and code:", email, code);
                return false;
            }
        } catch (error) {
            console.error("Error retrieving or updating document:", error);
            return false;
        }
    };

}

export const sendMail = new smtpEmail();