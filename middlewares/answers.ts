import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ResponseHandler from "../utils/responseHandler";
import { AdditionalResponse } from "../extensions/response";

const validateCreateAnswer = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      questionId: Joi.string().required().error(new Error("Please provide question Id")),
      answer: Joi.string().required().error(new Error("Please provide your answer")),
    });

    const { error, value } = schema.validate(payload);

    if (error) {
      return ResponseHandler.badRequest({ res, error: error.message });
    }

    res.data = value;
    return next();
  } catch (error) {
    return error;
  }
};

export default {
  validateCreateAnswer,
};
