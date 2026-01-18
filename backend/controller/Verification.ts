import { Request, Response } from "express";
import User from "../models/User";
import sendEmail from "../utils/emailService";
import { ResendVerificationBody } from "../types";

// ==================== Type Definitions ====================

type VerificationResponse = {
    message: string;
};

type VerificationErrorResponse = {
    message: string;
    error?: string;
};

// Use standard Request - params.token accessed at runtime
type VerifyEmailController = (
    req: Request,
    res: Response<VerificationResponse | VerificationErrorResponse>
) => Promise<void>;

type ResendVerificationController = (
    req: Request,
    res: Response<VerificationResponse | VerificationErrorResponse>
) => Promise<void>;

// ==================== Controller Functions ====================

const verifyEmail: VerifyEmailController = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error verifying email", error: (error as Error).message });
    }
};

const resendVerificationEmail: ResendVerificationController = async (req, res) => {
    try {
        const { email } = req.body as ResendVerificationBody;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ message: "Email already verified" });
            return;
        }

        // generating  a new token
        const verifyToken = user.generateToken();
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

        const message = `
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
        style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Your Email
      </a>
    `;

        await sendEmail({
            email: user.email,
            subject: `Email Verification - Resent`,
            message,
        });

        res.status(200).json({
            message: "Verification email resent successfully! Please check your inbox.",
        });
    } catch (error) {
        console.error("Error in resendVerificationEmail:", error);
        res.status(500).json({
            message: "Error resending verification email",
            error: (error as Error).message,
        });
    }
};

export { verifyEmail, resendVerificationEmail };
