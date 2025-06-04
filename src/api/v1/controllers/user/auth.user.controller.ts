import { Response, Request } from "express";
import { UserAuthService } from "../../services/user/auth.user.service";
import { ApiResponse } from "../../../../utils/response.util";
import { catchAsync } from "../../../../utils/catch-async.util";

export default class AuthController {
  authService = new UserAuthService();

  login = catchAsync(async (req: Request, res: Response) => {
    const response = await this.authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    return ApiResponse.success({
      res,
      message: response.message,
      data: response.data,
      statusCode: response.status,
    });
  });

  register = catchAsync(async (req: Request, res: Response) => {
    const response = await this.authService.register({
      email: req.body.email,
      password: req.body.password,
    });

    return ApiResponse.success({
      res,
      message: response.message,
      data: response.data,
      statusCode: response.status,
    });
  });
}
