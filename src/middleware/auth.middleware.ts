import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiResponse } from "../utils/response.util";
import { TUserRole, UserModel } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userType?: TUserRole;
    }
  }
}

// Verify JWT token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return ApiResponse.unauthorized({
        res,
        message: "Not authorized to access this route",
      });

    try {
      const decoded = jwt.verify(token, ENV.jwt.secret) as jwt.JwtPayload;

      const { id } = decoded;
      const user = await UserModel.findById(id);
      if (!user) {
        return ApiResponse.unauthorized({
          res,
          message: "User not found",
        });
      }
      req.user = user;
      req.userType = user.role;

      next();
    } catch (error) {
      return ApiResponse.unauthorized({
        res,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Restrict routes based on user role
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return ApiResponse.unauthorized({
        res,
        message: "User not authenticated",
      });

    if (!roles.includes(req.userType!)) {
      return ApiResponse.forbidden({
        res,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

export const validateRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized({
        res,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden({
        res,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

export const getTokenInfo = (req: Request): { id: string } | false => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return false;

    const decodedToken = jwt.verify(token, ENV.jwt.secret!) as {
      id: string;
    };
    return decodedToken;
  } catch (error) {
    console.log({ "TOKEN ERROR": error });
    return false;
  }
};
