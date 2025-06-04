import dotenv from "dotenv";
import path from "path";
import fs from "fs";

/**
 * Loads environment variables based on the current NODE_ENV
 */
export const loadEnv = (): void => {
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Define possible env file paths in order of precedence
  const envPaths = [
    path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
    path.resolve(process.cwd(), `.env.${NODE_ENV}`),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
  ];

  // Find the first env file that exists
  const envPath = envPaths.find(filePath => fs.existsSync(filePath));

  if (envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.error("Error loading env file:", result.error);
    } else {
      console.info(`Loaded environment variables from ${envPath}`);
    }
  } else {
    console.warn("No .env file found, using process environment variables");
    dotenv.config();
  }

  // Validate required environment variables
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
};

loadEnv();
export const ENV = {
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "8000",
    apiPrefix: process.env.API_PREFIX || "/api",
    apiVersion: process.env.API_VERSION || "v1",
    companyName: process.env.COMPANY_NAME || "Social Notch",
    userUrl: process.env.UI_URL || "http://localhost:3000",
    adminUrl: process.env.ADMIN_URL || "http://localhost:3001",
    vendorUrl: process.env.VENDOR_URK || "http://localhost:3002",
  },
  db: {
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/socialnotch",
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_jwt_secret_dev_only",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret_dev_only",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  email: {
    brevo: {
      apiKey: process.env.BREVO_API_KEY,
      senderName: process.env.SMS_SENDER_NAME,
    },
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "Social Notch",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
};
