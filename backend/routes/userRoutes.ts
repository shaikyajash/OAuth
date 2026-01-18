import express, { Router, RequestHandler } from "express";
import { handleUserDetails } from "../controller/userController";

const router: Router = express.Router();

router.get("/profile", handleUserDetails as RequestHandler);

export default router;
