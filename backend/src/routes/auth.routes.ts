import { Router } from "express";
import { AuthController } from "@users/controllers/auth-controller.js";

const authController = new AuthController();

export const authRouter = Router();

authRouter.post("/sign-in", authController.signIn);
authRouter.post("/log-in", authController.logIn);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/sign-out", authController.signOut);
