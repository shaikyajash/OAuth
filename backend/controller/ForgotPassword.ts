import { Request, Response } from "express";
import User from "../models/User";
import sendEmail from "../utils/emailService";
import { ForgotPasswordBody, ResetPasswordBody } from "../types";

// ==================== Type Definitions ====================

type PasswordResetResponse = {
    message: string;
};

type PasswordResetErrorResponse = {
    message: string;
    error?: string;
};

// Use standard Request - params/body accessed at runtime
type ForgotPasswordController = (
    req: Request,
    res: Response<PasswordResetResponse | PasswordResetErrorResponse>
) => Promise<void>;

type ResetPasswordController = (
    req: Request,
    res: Response<PasswordResetResponse | PasswordResetErrorResponse>
) => Promise<void>;

// ==================== Controller Functions ====================

const forgotPassword: ForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body as ForgotPasswordBody;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: " User not found" });
            return;
        }

        if (!user.isVerified) {
            res.status(401).json({ message: "Email not verified " });
            return;
        }

        const resetPasswordToken = user.generateResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
        const message = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });

        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        res.status(500).json({
            message: "Error sending password reset email",
            error: (error as Error).message,
        });
    }
};

const resetPassword: ResetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body as ResetPasswordBody;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }

        //updating the passsword
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error in resetting password", error: (error as Error).message });
    }
};

export { forgotPassword, resetPassword };
