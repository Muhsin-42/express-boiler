import {ENV} from "../../../../config/env";
import {SmsMessage, SmsResponse, SmsProvider} from "./types";
import axios from "axios";

export interface BrevoConfig {
  apiKey: string;
  // defaultSender?: string;
}

export class BrevoSmsProvider implements SmsProvider {
  private apiKey: string;
  private apiUrl: string = "https://api.brevo.com/v3/smtp/email";
  // private defaultSender: string;

  constructor(config: BrevoConfig) {
    this.apiKey = config.apiKey;
    // this.defaultSender = config.defaultSender || "YourCompany";
  }

  async sendSms(message: SmsMessage): Promise<SmsResponse> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          sender: {name: ENV.app.companyName, email: ENV.email.from},
          to: [{email: message.to, name: message.name}],
          subject: message.subject,
          htmlContent: message.htmlContent,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": this.apiKey,
          },
        }
      );

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
