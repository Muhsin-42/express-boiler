import AdminAuthService from "../../services/admin/auth.admin.service";
import { Response, Request } from "express";
import { ApiResponse } from "../../../../utils/response.util";
import { catchAsync } from "../../../../utils/catch-async.util";
export default class AdminAuthController {
  authService = new AdminAuthService();

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
}
