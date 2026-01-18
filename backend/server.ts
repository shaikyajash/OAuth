import express, { Express, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { sendCookie } from "./utils/Reuseable";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app: Express = express();

const allowedOrigins: (string | undefined)[] = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3,
];

//Enabling cors
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handles preflight requests

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));

// Middleware
app.use(express.json());

// Middleware to handle invalid JSON errors
app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
        console.error("Invalid JSON:", err.message);
        res.status(400).json({ message: "Invalid JSON format. Please check your request." });
        return;
    }
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.get("/test", (_req: Request, res: Response): void => {
    sendCookie(res, "testCookie", "This is a test cookie", 200, 30);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Error handler for unmatched routes
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
