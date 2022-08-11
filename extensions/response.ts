import { Response } from "express";
export interface AdditionalResponse extends Response {
  data?: any;
  user?: any;
}

export interface JwtPayload {
  id: string;
  email: string;
}
