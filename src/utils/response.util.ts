import { Response } from "express";
import { HTTP } from "../config/http-status.config";

interface ResponseData {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
  statusCode?: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponse {
  // Success responses
  static success({
    res,
    data = null,
    message = "Success",
    statusCode = HTTP.OK,
  }: {
    res: Response;
    data?: any;
    message?: string;
    statusCode?: number;
  }): Response {
    const responseData: ResponseData = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(responseData);
  }

  static created({
    res,
    data = null,
    message = "Resource created successfully",
  }: {
    res: Response;
    data?: any;
    message?: string;
  }): Response {
    return this.success({ res, data, message, statusCode: HTTP.CREATED });
  }

  // Error responses
  static error({
    res,
    message = "Internal server error",
    statusCode = HTTP.INTERNAL_SERVER_ERROR,
    error = null,
  }: {
    res: Response;
    message?: string;
    statusCode?: number;
    error?: any;
  }): Response {
    const responseData: ResponseData = {
      success: false,
      message,
      error,
      statusCode,
    };

    return res.status(statusCode).json(responseData);
  }

  static badRequest({
    res,
    message = "Bad request",
    error = null,
  }: {
    res: Response;
    message?: string;
    error?: any;
  }): Response {
    return this.error({ res, message, statusCode: HTTP.BAD_REQUEST, error });
  }

  static unauthorized({
    res,
    message = "Unauthorized",
    error = null,
  }: {
    res: Response;
    message?: string;
    error?: any;
  }): Response {
    return this.error({ res, message, statusCode: HTTP.UNAUTHORIZED, error });
  }

  static forbidden({
    res,
    message = "Forbidden",
    error = null,
  }: {
    res: Response;
    message?: string;
    error?: any;
  }): Response {
    return this.error({ res, message, statusCode: HTTP.FORBIDDEN, error });
  }

  static notFound({
    res,
    message = "Resource not found",
    error = null,
  }: {
    res: Response;
    message?: string;
    error?: any;
  }): Response {
    return this.error({ res, message, statusCode: HTTP.NOT_FOUND, error });
  }

  // Paginated response
  static paginated({
    res,
    data = [],
    page = 1,
    limit = 10,
    total = 0,
    message = "Success",
  }: {
    res: Response;
    data?: any;
    page?: number;
    limit?: number;
    total?: number;
    message?: string;
  }): Response {
    const responseData: ResponseData = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };

    return res.status(HTTP.OK).json(responseData);
  }
}

export const paginated = ({
  res,
  data = [],
  page = 1,
  limit = 10,
  total = 0,
  message = "Success",
}: {
  res: Response;
  data?: any;
  page?: number;
  limit?: number;
  total?: number;
  message?: string;
}): Response => {
  const responseData: ResponseData = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };

  return res.status(HTTP.OK).json(responseData);
};
