import nodemailer from "nodemailer";
import { EmailOptions } from "../types";

const sendEmail = async (options: EmailOptions): Promise<void> => {
    console.log("Attempting to send email to:", options.email);
    console.log("EMAIL_USER configured:", process.env.EMAIL_USER ? "Yes" : "No");
    console.log("EMAIL_PASS configured:", process.env.EMAIL_PASS ? "Yes" : "No");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Animestry" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error; // Re-throw to let the controller handle it
    }
};

export default sendEmail;
