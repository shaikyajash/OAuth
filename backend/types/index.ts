import { Document, Model, Types } from "mongoose";
import { Request } from "express";

// ==================== User & Authentication Types ====================
// Note: IUser and IUserMethods must be interfaces for Mongoose Document extension

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    picture?: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
}

export type IUserMethods = {
    comparePassword(enteredPassword: string): Promise<boolean>;
    generateToken(): string;
    generateResetToken(): string;
}

export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;



export type JwtPayload = {
    id: string;
    name: string;
    email: string;
    picture?: string;
    iat?: number;
    exp?: number;
};

export type GoogleTicketPayload = {
    name: string;
    email: string;
    picture: string;
    sub: string;
};

// ==================== Request Body Types ====================

export type RegisterBody = {
    name: string;
    email: string;
    password: string;
};

export type LoginBody = {
    email: string;
    password: string;
};

export type GoogleAuthBody = {
    idtoken: string;
};

export type ForgotPasswordBody = {
    email: string;
};

export type ResetPasswordBody = {
    password: string;
};

export type ResendVerificationBody = {
    email: string;
};

// ==================== Request Params Types ====================

export type TokenParams = {
    token: string;
};

export type EmptyObject = Record<string, never>;

// ==================== Response Types ====================

export type UserData = {
    id: Types.ObjectId;
    name: string;
    email: string;
    picture: string | null;
};

export type UserDetailsResponse = {
    msg: string;
    status: string;
    data: UserData;
};

export type ErrorResponse = {
    message: string;
    error?: string;
};

export type SuccessResponse = {
    message: string;
};

export type TokenResponse = {
    accessToken: string;
};

// ==================== Middleware Types ====================
// Note: AuthRequest must extend Request interface

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export type ValidationErrorItem = {
    field?: string;
    message: string;
};

// ==================== Email Types ====================

export type EmailOptions = {
    email: string;
    subject: string;
    message: string;
};

// ==================== Environment Variables ====================

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            MONGO_URI: string;
            JWT_SECRET: string;
            ACCESS_SECRET: string;
            REFRESH_SECRET: string;
            GOOGLE_CLIENT_ID: string;
            FRONTEND_URL: string;
            FRONTEND_URL_2?: string;
            FRONTEND_URL_3?: string;
            EMAIL_USER: string;
            EMAIL_PASS: string;
        }
    }
}

export { };
