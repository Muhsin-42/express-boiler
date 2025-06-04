import {smsConfig} from "../../../../config/sms.config";
import {BrevoSmsProvider} from "./brevo.provider";
import {SmsMessage, SmsResponse, SmsProvider} from "./types";

export class SmsService {
  constructor(private provider: SmsProvider) {}

  async sendSms(message: SmsMessage): Promise<SmsResponse> {
    return this.provider.sendSms(message);
  }

  async sendBulkSms(messages: SmsMessage[]): Promise<SmsResponse[]> {
    const responses: SmsResponse[] = [];

    for (const message of messages) {
      const response = await this.provider.sendSms(message);
      responses.push(response);
    }

    return responses;
  }
}

const brevoProvider = new BrevoSmsProvider({
  apiKey: smsConfig.brevo.apiKey,
});

// Create the SMS service with the provider
export const smsService = new SmsService(brevoProvider);
