import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";
import { JwtPayload, UserData, UserDetailsResponse, ErrorResponse } from "../types";

// ==================== Type Definitions ====================

type UserDetailsErrorResponse = {
    msg: string;
    status: string;
    data: string;
};

type UserResponse = UserDetailsResponse | UserDetailsErrorResponse | ErrorResponse;

type HandleUserDetailsController = (
    req: Request,
    res: Response<UserResponse>
) => Promise<void>;

// ==================== Controller Functions ====================

const handleUserDetails: HandleUserDetailsController = async (req, res) => {
    try {
        // Check if user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Authorization token missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        console.log("Token at user controller:", token);
        console.log("Access secret:", process.env.ACCESS_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET) as JwtPayload;

        console.log("Decoded user:", decoded);
        const user = await User.findById(decoded.id).select("-password");
        console.log("User fetched:", user);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const data: UserData = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture || null,
        };

        const response: UserDetailsResponse = {
            msg: "User details fetched successfully",
            status: "T",
            data: data,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching user details",
            status: "F",
            data: (error as Error).message,
        });
    }
};

export { handleUserDetails };
