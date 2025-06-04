import { HTTP } from "../../../../config/http-status.config";
import { ServiceResponse } from "../../../../typings";

export default class PublicService {

  async findTermsAndConditions(): ServiceResponse {
    try {
      return {
        status: HTTP.OK,
        success: true,
        data: {},
        message: "Terms and Conditions fetched successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
