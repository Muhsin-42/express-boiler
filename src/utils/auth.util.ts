import bcryptjs from "bcryptjs";

// Hash password
export const hashPassword = (password: string): string => {
  return bcryptjs.hashSync(password, 10);
};
