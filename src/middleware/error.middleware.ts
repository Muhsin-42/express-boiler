import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";
import { ApiResponse } from "../utils/response.util";

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired. Please log in again", 401);
};

// Send error response based on environment
const sendErrorDev = (err: AppError, res: Response) => {
  ApiResponse.error({
    res,
    message: err.message,
    statusCode: err.statusCode,
    error: {
      status: err.statusCode,
      error: err,
      message: err.message,
      stack: err.stack,
    },
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    ApiResponse.error({
      res,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.error("ERROR 💥", err);
    ApiResponse.error({
      res,
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};

// Global error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (ENV.app.nodeEnv === "development") {
    sendErrorDev(err, res);
  } else if (ENV.app.nodeEnv === "production") {
    let error = { ...err };
    error.message = err.message;

    // Mongoose errors handling
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
