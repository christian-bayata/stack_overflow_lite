import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ResponseHandler from "../utils/responseHandler";
import { AdditionalResponse } from "../extensions/response";

const validateCreateQuestion = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      question: Joi.string().required().error(new Error("Question is required to be inputed.")),
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

const validateQuestion = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      questionId: Joi.number().required().error(new Error("Please input the question id")),
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
  validateCreateQuestion,
  validateQuestion,
};
