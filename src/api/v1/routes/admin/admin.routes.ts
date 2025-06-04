import express from "express";
import adminAuthRouter from "./auth.admin.routes";
const adminRoutes: express.Router = express.Router();

// ===>  v1/admin/
adminRoutes.use("/auth", adminAuthRouter);

//use auth middleware only after auth routes
// adminAdminsRouter.use(adminAuthMiddleware);

// adminRoutes.use("/statuses", adminStatusRouter);
export default adminRoutes;
