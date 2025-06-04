import mongoose from "mongoose";
import { ENV } from "./env";
import logger from "../utils/logger.util";

export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  try {
    // Set mongoose options
    mongoose.set("strictQuery", true);

    // Connection options
    const options: mongoose.ConnectOptions = {
      autoIndex: ENV.app.nodeEnv !== "production", // Don't build indexes in production
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(ENV.db.mongoUri, options);

    logger.info("MongoDB connected");

    mongoose.connection.on("error", err => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed due to app termination");
        process.exit(0);
      } catch (err) {
        logger.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });

    return connection;
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

/**
 * Closes MongoDB connection
 */
export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error("Error closing MongoDB connection:", error);
    throw error;
  }
};
