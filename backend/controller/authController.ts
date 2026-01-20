import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import sendEmail from "../utils/emailService";
import {
    refershTokenGenerator,
    accessTokenGenerator,
} from "../utils/Reuseable";
import {
    RegisterBody,
    LoginBody,
    GoogleAuthBody,
    JwtPayload,
    GoogleTicketPayload,
    ErrorResponse,
    SuccessResponse,
    TokenResponse,
} from "../types";

// ==================== Type Definitions ====================

type RegisterController = (
    req: Request<Record<string, string>, SuccessResponse | ErrorResponse, RegisterBody>,
    res: Response<SuccessResponse | ErrorResponse>
) => Promise<void>;

type LoginController = (
    req: Request<Record<string, string>, TokenResponse | ErrorResponse, LoginBody>,
    res: Response<TokenResponse | ErrorResponse>
) => Promise<void>;

type GoogleAuthController = (
    req: Request<Record<string, string>, TokenResponse | ErrorResponse, GoogleAuthBody>,
    res: Response<TokenResponse | ErrorResponse>
) => Promise<void>;

type NewAccessTokenController = (
    req: Request,
    res: Response<TokenResponse | ErrorResponse>
) => Promise<void>;

// ==================== Controller Functions ====================

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register Controller
const register: RegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });

        console.log("verified : ", user?.isVerified);
        // If user exists and is verified, reject
        if (user && user.isVerified) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // If user exists but not verified, update their info and resend verification
        if (user && !user.isVerified) {
            user.name = name;
            user.password = password; // Will be hashed by pre-save hook
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
                subject: `Email Verification`,
                message,
            });

            res.status(200).json({
                message: "A new verification email has been sent. Please check your inbox.",
            });
            return;
        }

        // Create new user
        user = await User.create({
            name,
            email,
            password,
        });

        // Generating verification token
        const verifyToken = user.generateToken();
        await user.save();

        // Send verification email
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
            subject: `Email Verification`,
            message,
        });

        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
        });

    } catch (error) {
        res.status(500).json({ message: "Error in registration", error: (error as Error).message });
    }
};

//Google Signup Controller
const googleAuth: GoogleAuthController = async (req, res) => {
    try {
        const { idtoken } = req.body;
        if (!idtoken) {
            res.status(400).json({ message: "Google token not found" });
            return;
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: idtoken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { name, email, picture, sub: googleId } = payload as GoogleTicketPayload;

        if (!email) {
            res.status(400).json({ message: "Email not found in Google account" });
            return;
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        //Making a temporary password for google users
        const tempPassword = crypto.randomBytes(6).toString("hex");

        if (user) {
            // User exists - check if they have Google ID linked
            if (!user.googleId) {
                // If no Google ID, associate the Google account
                user.googleId = googleId;
                user.picture = picture;
                user.isVerified = true;
                await user.save();
            }
        } else {
            // If user doesn't exist, creating a new one using Google credentials
            user = await User.create({
                name,
                email,
                googleId,
                picture,
                password: tempPassword,
                isVerified: true,
            });
        }

        //Generating token
        const jwtPayload: JwtPayload = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            picture: user.picture,
        };

        const accessToken = accessTokenGenerator(jwtPayload);
        const refreshToken = refershTokenGenerator(jwtPayload);
        //Setting cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Error in Google Signup/Login:", (error as Error).message);
        res.status(500).json({ message: "Error in Google Signup/Login", error: (error as Error).message });
    }
};

// Login Controller
const login: LoginController = async (req, res) => {


    console.log("Login endpoint hit!");
    try {
        const { email, password } = req.body;
        //Finding the user by email
        const user = await User.findOne({ email });
        //Checking if the user exists
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        console.log("isverified: ", user?.isVerified)

        // Check if the user has verified their email
        if (!user.isVerified) {
            // If not verified, send a verification email again
            const verifyToken = user.generateToken();
            await user.save();

            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
            const message = `<p>You tried to log in without verifying your email. Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`;

            await sendEmail({
                email: user.email,
                subject: "Verify Your Email",
                message,
            });

            res.status(403).json({
                message: "Please verify your email. A new verification link has been sent to your email.",
            });
            return;
        }

        //Checking password using the function I created in User.js
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        //Generating token

        const jwtPayload: JwtPayload = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            picture: user.picture,
        };

        const accessToken = accessTokenGenerator(jwtPayload);
        const refreshToken = refershTokenGenerator(jwtPayload);

        //Setting cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Error in login:", (error as Error).message);
        res.status(500).json({ message: "Error in login", error: (error as Error).message });
    }
};





const newAccessToken: NewAccessTokenController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({
            message: "Refresh token not found, please login again",
        });
        return;
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET) as JwtPayload;
        const payload: JwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
        };
        const newAccessToken = accessTokenGenerator(payload);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token, please login again" });
    }
};

export { register, login, googleAuth, newAccessToken };
