export interface SmsMessage {
  to: string;
  name: string;
  subject: string;
  htmlContent?: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsProvider {
  sendSms(message: SmsMessage): Promise<SmsResponse>;
}
