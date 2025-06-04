import express, { NextFunction, Request, Response } from "express";
import AdminAuthController from "../../controllers/admin/auth.admin.controller";
const adminAuthRouter = express.Router();
const adminAuthController = new AdminAuthController();

// ===>  v1/admin/auth/

adminAuthRouter.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) =>
    adminAuthController.login(req, res, next)
);

export default adminAuthRouter;
