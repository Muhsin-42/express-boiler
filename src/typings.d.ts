export type ServiceResponse<T = {} | [] | any> = Promise<{
  success: boolean;
  data?: T;
  status: number;
  message: string;
}>;
