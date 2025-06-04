import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

export type TUserRole = "user" | "vendor" | "admin" | "city_admin" | "support";

export interface IUser {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  role: TUserRole;
  city?: string;
  isVerified?: boolean;
  permissions?: string[];
  profileImage?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive?: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: false, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin", "city_admin", "support"],
      default: "user",
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    isVerified: { type: Boolean, default: false },
    permissions: { type: [String], default: [] },
    profileImage: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

export const USER_DB_REF = "users";
export const UserModel = mongoose.model(USER_DB_REF, userSchema);
