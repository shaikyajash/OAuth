import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import { IUser, IUserMethods, UserModel } from "../types";

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Password is optional for Google sign-in
    googleId: { type: String, required: false },
    picture: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiry: { type: Date },
});


// Hash password only if it exists
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Compare Password Method
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    if (!this.password) {
        throw new Error("Password not set for this account");
    }
    return await bcrypt.compare(enteredPassword, this.password);
};



//Generating verification token
userSchema.methods.generateToken = function (): string {
    const token = crypto.randomBytes(20).toString("hex");
    this.verificationToken = token;
    this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // token valid for 24hours
    return token;
};



//Generating Password Reset Token
userSchema.methods.generateResetToken = function (): string {
    const token = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = token;
    this.resetPasswordTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); //30 Minutes
    return token;
};





const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
