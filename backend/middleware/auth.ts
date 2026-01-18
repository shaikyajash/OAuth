import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest, JwtPayload } from "../types";

// ==================== Type Definitions ====================

type ErrorMessage = {
    message: string;
};

type JwtPayloadWithRole = JwtPayload & {
    role?: string;
};

// ==================== Middleware Functions ====================

const protect = async (
    req: AuthRequest,
    res: Response<ErrorMessage>,
    next: NextFunction
): Promise<void | Response<ErrorMessage>> => {
    try {
        let token: string | undefined;

        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken as string;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized to access this route" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET) as JwtPayload;
        req.user = decoded;
        next();

    } catch (error) {
        console.error((error as Error).message);
        return res.status(401).json({ message: "Not authorized to access this route" });
    }
};

const authorize = (...roles: string[]) => {
    return (
        req: AuthRequest,
        res: Response<ErrorMessage>,
        next: NextFunction
    ): void | Response<ErrorMessage> => {
        const user = req.user as JwtPayloadWithRole | undefined;
        const userRole = user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                message: `User role ${userRole ?? "undefined"} is not authorized to access this route`,
            });
        }
        next();
    };
};

export { protect, authorize };
