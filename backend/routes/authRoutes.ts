import express, { Router, Request, Response, RequestHandler } from "express";
import {
    register,
    login,
    googleAuth,
    newAccessToken,
} from "../controller/authController";
import {
    validateRegister,
    validateLogin,
    validatePasswordReset,
} from "../middleware/validator";
import {
    verifyEmail,
    resendVerificationEmail,
} from "../controller/Verification";
import { forgotPassword, resetPassword } from "../controller/ForgotPassword";

const router: Router = express.Router();

// Example Auth Routes
router.get("/", (_req: Request, res: Response): void => {
    res.json({ message: "Auth route is working!" });
});

// Cast handlers to RequestHandler to avoid type conflicts when chaining middleware
router.post("/register", validateRegister as RequestHandler, register as RequestHandler);

router.post("/GoogleAuth", googleAuth as RequestHandler);

router.post("/login", validateLogin as RequestHandler, login as RequestHandler);

router.get("/verify-email/:token", verifyEmail as RequestHandler);

router.post("/forgot-password", forgotPassword as RequestHandler);

router.post("/reset-password/:token", validatePasswordReset as RequestHandler, resetPassword as RequestHandler);

router.get("/refresh-token", newAccessToken as RequestHandler);

router.post("/resend-verification", resendVerificationEmail as RequestHandler);

router.get("/logout", (_req: Request, res: Response): void => {
    res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
});

export default router;
