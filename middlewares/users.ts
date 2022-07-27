import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ResponseHandler from "../utils/responseHandler";
import { AdditionalResponse } from "../extensions/response";
import usersQueries from "../queries/users";
import bcrypt from "bcrypt";

const signupValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  const regexAlpha = /^[a-zA-Z]+$/;
  const regexPhone = /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;

  try {
    const schema = Joi.object({
      firstName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("First name must not be empty and must contain only letters")),
      lastName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("Last name must not be empty and must contain only letters")),
      email: Joi.string().email().lowercase().required().error(new Error("Email must be a valid email")),
      password: Joi.string().min(7).required().error(new Error("Email must be a valid email")),
      phone: Joi.string().regex(regexPhone).length(11).required().error(new Error("Phone number must be valid")),
      city: Joi.string().min(5).max(30).required().error(new Error("City information must be valid")),
      state: Joi.string().min(5).max(30).required().error(new Error("State must be valid")),
      verCode: Joi.string().max(6).required().error(new Error("Please provide your verification code")),
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

const validateExistingUser = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const { email, phone } = res.data;

  try {
    const getUser = await usersQueries.findUserEmailAndPhone({ email, phone });
    if (getUser) {
      return ResponseHandler.badRequest({ res, error: "User with this email and/or phone number already exists." });
    }

    // Hashs the user password;
    res.data.password = bcrypt.hashSync(res.data.password, 10);

    res.user = getUser;
    return next();
  } catch (error) {
    return error;
  }
};

const validateUserLogin = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      email: Joi.string().email().lowercase().required().error(new Error("Email must be a valid email")),
      password: Joi.string().min(7).required().error(new Error("Email must be a valid email")),
    });

    const { value, error } = schema.validate(payload);

    if (error) return ResponseHandler.badRequest({ res, error: error.message });
    res.data = value;
    return next();
  } catch (error) {
    return error;
  }
};

export default {
  signupValidation,
  validateExistingUser,
  validateUserLogin,
};
