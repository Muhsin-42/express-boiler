import winston from "winston";

// Define our custom logger interface
interface CustomLogger {
  error(message: any, ...meta: any[]): void;
  warn(message: any, ...meta: any[]): void;
  info(message: any, ...meta: any[]): void;
  http(message: any, ...meta: any[]): void;
  debug(message: any, ...meta: any[]): void;
}

// Define custom severity levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to Winston
winston.addColors(colors);

const formatTimestamp = (timestamp: string | number | Date): string => {
  let date: Date;

  if (typeof timestamp === "string") {
    // Fix the format: Remove the last colon and ensure milliseconds are valid
    const fixedTimestamp = timestamp.replace(/:(\d{3,4})$/, ".$1"); // Convert last `:` to `.`
    date = new Date(fixedTimestamp);
  } else {
    date = new Date(timestamp);
  }

  // If the date is invalid, return the original timestamp
  if (isNaN(date.getTime())) {
    return String(timestamp);
  }

  return date
    .toLocaleString("en-US", {
      month: "short", // "Mar"
      day: "2-digit", // "27"
      hour: "2-digit", // "11"
      minute: "2-digit", // "25"
      second: "2-digit", // "10"
      hour12: false, // Use 24-hour format
    })
    .replace(",", ""); // Remove the comma for formatting
};

const developmentFormat = winston.format.combine(
  winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss:ms"}),
  winston.format.colorize({all: true}),
  winston.format.printf((info) => {
    // Ensure timestamp is a string before passing to Date constructor
    const dateStr: string = formatTimestamp(
      info.timestamp as string | number | Date
    );

    return `${dateStr} ${info.level}: ${info.message}`;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss:ms"}),
  winston.format.json()
);

// Create transports
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({all: true}),
      process.env.NODE_ENV === "development"
        ? developmentFormat
        : productionFormat
    ),
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/all.log",
  }),
];

// Create logger instance
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format:
    process.env.NODE_ENV === "development"
      ? developmentFormat
      : productionFormat,
  transports,
});

// Create our custom logger that only exposes the methods we want
const logger: CustomLogger = {
  error: (message: any, ...meta: any[]) =>
    winstonLogger.error(message, ...meta),
  warn: (message: any, ...meta: any[]) => winstonLogger.warn(message, ...meta),
  info: (message: any, ...meta: any[]) => winstonLogger.info(message, ...meta),
  http: (message: any, ...meta: any[]) => winstonLogger.http(message, ...meta),
  debug: (message: any, ...meta: any[]) =>
    winstonLogger.debug(message, ...meta),
};

export default logger;
