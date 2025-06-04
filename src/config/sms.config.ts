import dotenv from "dotenv";
import {ENV} from "./env";
dotenv.config();

export const smsConfig = {
  brevo: {
    apiKey: ENV.email.brevo.apiKey || "",
    defaultSender: ENV.email.brevo.senderName,
  },
};
