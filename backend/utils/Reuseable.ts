import jwt from "jsonwebtoken";
import { Response } from "express";
import { JwtPayload } from "../types";

const refershTokenGenerator = (payload: JwtPayload): string => {
    try {
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
            expiresIn: "7d",
        });

        return refreshToken;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Refresh token generation failed");
    }
};

const accessTokenGenerator = (payload: JwtPayload): string => {
    try {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
            expiresIn: "15m",
        });

        return accessToken;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Access token generation failed");
    }
};

const sendCookie = (
    res: Response,
    name: string,
    value: string,
    statusCode: number = 200,
    expiryMinutes: number
): void => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            expires: new Date(Date.now() + expiryMinutes * 60 * 1000),
        };

        res
            .status(statusCode)
            .cookie(name, value, options)
            .json({
                success: true,
                message: `${name} cookie sent successfully`,
            });
    } catch (error) {
        console.error("Error sending cookie:", error);
        res.status(500).json({ success: false, message: "Failed to send cookie" });
    }
};

export { sendCookie, refershTokenGenerator, accessTokenGenerator };
