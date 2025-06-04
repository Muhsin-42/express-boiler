import express from "express";
import publicRoutes from "./public/public.routes";
import adminRoutes from "./admin/admin.routes";
import userRoutes from "./user/user.routes";

const v1Routes: express.Router = express.Router();

v1Routes.use("/admin", adminRoutes);
v1Routes.use("/user", userRoutes);
v1Routes.use("/public", publicRoutes);

export default v1Routes;
