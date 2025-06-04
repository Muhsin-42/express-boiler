import jwt, { SignOptions } from "jsonwebtoken";
import { ServiceResponse } from "../../../../typings";
import { ENV } from "../../../../config/env";
import { UserModel } from "../../../../models/user.model";
import { hashPassword } from "../../../../utils/auth.util";
import { AppError } from "../../../../middleware/error.middleware";
import { HTTP } from "../../../../config/http-status.config";

interface UserLoginParams {
  email: string;
  password: string;
}

export class UserAuthService {
  private readonly jwtSecret = ENV.jwt.secret;
  private readonly userModel = UserModel;

  public generateToken(userId: string): string {
    const expiresIn = ENV.jwt.expiresIn;

    const options: SignOptions = {
      expiresIn: expiresIn as any,
    };

    return jwt.sign(
      { id: userId, type: "user" },
      this.jwtSecret,
      options
    ) as string;
  }

  async login(params: UserLoginParams): ServiceResponse {
    try {
      const user = await this.userModel.findOne({ email: params.email });
      if (!user) {
        throw new AppError("User not found", HTTP.NOT_FOUND);
      }

      const isPasswordMatched = await user.comparePassword(params.password);
      if (!isPasswordMatched) {
        throw new AppError("Invalid credentials", HTTP.UNAUTHORIZED);
      }
      const token = this.generateToken(user._id.toString());
      return {
        data: { token },
        message: "Login successful",
        status: HTTP.OK,
        success: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  async register(params: UserLoginParams): ServiceResponse {
    try {
      const user = await this.userModel.findOne({ email: params.email });
      if (user) throw new AppError("User already exists", HTTP.CONFLICT);

      const hashedPassword = hashPassword(params.password);
      const newUser = await this.userModel.create({
        email: params.email,
        password: hashedPassword,
        role: "user",
      });
      const token = this.generateToken(newUser._id.toString());
      return {
        data: { token },
        message: "Register successful",
        status: HTTP.CREATED,
        success: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }
}
