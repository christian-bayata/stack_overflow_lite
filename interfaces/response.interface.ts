import { Response } from "express";

export interface configureDataInput {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
  error?: string;
}

export interface buildResponseOutput {
  success: boolean;
  message: string;
  data: {};
}
