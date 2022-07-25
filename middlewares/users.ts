import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ErrorHandler from "../utils/errorHandler";
import { AdditionalResponse } from "../extensions/response";

const signupValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  const regexAlpha = /^[a-zA-Z]+$/;
  const regexPhone = /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;

  try {
    const schema = Joi.object({
      firstName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("First name must not be empty and must contain only letters")),
      lastName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("Last name must not be empty and must contain only letters")),
      email: Joi.string().email().lowercase().required().error(new Error("Admin email must be a valid email")),
      phone: Joi.string().regex(regexPhone).length(11).required().error(new Error("Phone number must be valid")),
      city: Joi.string().min(5).max(30).required().error(new Error("City information must be valid")),
      state: Joi.string().min(5).max(30).required().error(new Error("State must be valid")),
    });

    const { error, value } = schema.validate(payload);

    if (error) {
      return ErrorHandler.badRequest({ res, error: error.message });
    }

    res.data = value;
  } catch (error) {
    return error;
  }
};

export default {
  signupValidation,
};
