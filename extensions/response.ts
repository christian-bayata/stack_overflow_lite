import { Response } from "express";
export interface AdditionalResponse extends Response {
  data?: any;
  user?: any;
  admin?: any;
}

export interface JwtPayload {
  id: string;
  email: string;
}
