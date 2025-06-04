import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../../../../config/env";
import { UserModel } from "../../../../models/user.model";
import { ServiceResponse } from "../../../../typings";
import { AppError } from "../../../../middleware/error.middleware";
import { HTTP } from "../../../../config/http-status.config";

export default class AdminAuthService {
  private readonly userModel = UserModel;
  private readonly jwtSecret = ENV.jwt.secret;

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): ServiceResponse {
    try {
      const user = await this.userModel.findOne({ email, role: "admin" });
      if (!user) throw new AppError("User not found", 404);

      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) throw new AppError("Invalid credentials", 401);

      const token = this.generateToken(user._id.toString());
      return {
        data: { token },
        message: "Login successful",
        status: HTTP.OK,
        success: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError((error as Error).message, 500);
    }
  }

  private generateToken(userId: string): string {
    const expiresIn = ENV.jwt.expiresIn || "7d";

    const options: SignOptions = {
      expiresIn: expiresIn as any,
    };
    return jwt.sign(
      { id: userId, type: "admin" },
      this.jwtSecret,
      options
    ) as string;
  }
}
