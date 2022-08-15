import "express-async-errors";
import { Request, Response, NextFunction } from "express";
import { AdditionalResponse } from "../extensions/response";
import ResponseHandler from "../utils/responseHandler";

const create = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { questionId, answer } = req.body;
  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });
};

export default {
  create,
};
