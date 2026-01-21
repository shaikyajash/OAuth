import { Resend } from "resend";
import { EmailOptions } from "../types";

const sendEmail = async (options: EmailOptions): Promise<void> => {
    console.log("Attempting to send email to:", options.email);
    console.log("RESEND_API_KEY configured:", process.env.RESEND_API_KEY ? "Yes" : "No");

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Animestry <onboarding@resend.dev>",
            to: options.email,
            subject: options.subject,
            html: options.message,
        });

        if (error) {
            console.error("Email sending failed:", error);
            throw error;
        }

        console.log("Email sent successfully:", data?.id);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error; // Re-throw to let the controller handle it
    }
};

export default sendEmail;
