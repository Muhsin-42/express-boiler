import {Response, Request} from "express";
import {ApiResponse} from "../../../../utils/response.util";
import PublicService from "../../services/public/public.service";
import { catchAsync } from "../../../../utils/catch-async.util";
export default class PublicController {
  publicService = new PublicService();

  findTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
    const response = await this.publicService.findTermsAndConditions();

    return ApiResponse.success({
      res,
      message: response.message,
      data: response.data,
      statusCode: response.status,
    });
  });
}
