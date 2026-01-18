import { Request, Response, NextFunction } from "express";

// ==================== Type Definitions ====================

type ValidationErrorResponse = {
    message: string[];
};

type RegisterRequestBody = {
    email: string;
    password: string;
    name: string;
};

type LoginRequestBody = {
    email: string;
    password: string;
};

type PasswordResetRequestBody = {
    password: string;
};

// ==================== Validator Functions ====================

const validateRegister = (
    req: Request<Record<string, string>, ValidationErrorResponse, RegisterRequestBody>,
    res: Response<ValidationErrorResponse>,
    next: NextFunction
): void | Response<ValidationErrorResponse> => {
    const { email, password, name } = req.body;

    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    if (!email || !email.match(/^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/)) {
        errors.push("Please provide a valid email");
    }

    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    next();
};

const validateLogin = (
    req: Request<Record<string, string>, ValidationErrorResponse, LoginRequestBody>,
    res: Response<ValidationErrorResponse>,
    next: NextFunction
): void | Response<ValidationErrorResponse> => {
    const { email, password } = req.body;

    const errors: string[] = [];

    if (!email || !email.match(/^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/)) {
        errors.push("Please provide a valid email");
    }

    if (!password) {
        errors.push("Password is required");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    next();
};

const validatePasswordReset = (
    req: Request<Record<string, string>, ValidationErrorResponse, PasswordResetRequestBody>,
    res: Response<ValidationErrorResponse>,
    next: NextFunction
): void | Response<ValidationErrorResponse> => {
    const { password } = req.body;

    const errors: string[] = [];

    if (!password) {
        errors.push("Password is required");
    } else {
        if (password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    next();
};

export { validateRegister, validateLogin, validatePasswordReset };
