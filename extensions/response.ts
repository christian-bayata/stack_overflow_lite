import { Response } from "express";
export interface AdditionalResponse extends Response {
  data?: any;
  user?: any;
}
