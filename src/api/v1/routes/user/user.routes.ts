import express from "express";
import AuthController from "../../controllers/user/auth.user.controller";
const userRoutes: express.Router = express.Router();

// Auth routes

// // Protected routes
const authController = new AuthController();

userRoutes.post("/auth/login", authController.login.bind(authController));
userRoutes.post("/auth/register", authController.register.bind(authController));

export default userRoutes;
