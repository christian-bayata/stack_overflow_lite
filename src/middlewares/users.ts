import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ResponseHandler from "../utils/responseHandler";
import { AdditionalResponse } from "../../src/interfaces/response.interface";
import usersQueries from "../queries/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../src/interfaces/user.interface";

const EmailValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      email: Joi.string().email().lowercase().required().error(new Error("Please provide email and/or email must be a valid email")),
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

const signupValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  const regexAlpha = /^[a-zA-Z]+$/;
  const regexPhone = /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;

  try {
    const schema = Joi.object({
      firstName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("First name must not be empty and must contain only letters")),
      lastName: Joi.string().regex(regexAlpha).min(3).max(15).required().error(new Error("Last name must not be empty and must contain only letters")),
      email: Joi.string().email().lowercase().required().error(new Error("Email must be a valid email")),
      password: Joi.string().min(7).required().error(new Error("Password must be more than 7 characters")),
      phone: Joi.string().regex(regexPhone).length(11).required().error(new Error("Phone number must be valid")),
      city: Joi.string().min(5).max(30).required().error(new Error("City information must be valid")),
      state: Joi.string().min(5).max(30).required().error(new Error("State must be valid")),
      verCode: Joi.string().max(6).required().error(new Error("Please provide your verification code")),
      userTypes: Joi.string().min(3).required().error(new Error("Please provide your user type")),
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

const authenticateUser = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const { authorization } = req.headers;

  // JWT decode - id/email in the user token;
  try {
    var decoded = jwt.verify(authorization as string, process.env.JWT_SECRET as string) as JwtPayload;
    if (!authorization || !decoded.id || !decoded.email) return ResponseHandler.unAuthorized({ res, error: "Unauthorized, please login." });

    // Get the user information
    const getUser = await usersQueries.findUser({ id: decoded.id });
    if (!getUser) return ResponseHandler.notFound({ res, error: "User not found" });

    const privileges = getUser?.userTypes?.split(",");

    const admin = privileges.includes("admin");
    const user = privileges.includes("user");

    res.user = getUser;
    res.admin = admin;
    return next();
  } catch (error) {
    return { error };
  }
};

const resetPasswordValidation = async (req: Request, res: AdditionalResponse, next: NextFunction) => {
  const payload = req.body;

  try {
    const schema = Joi.object({
      password: Joi.string().min(7).required().error(new Error("Please provide password and it must be greater than 7")),
      confirmPassword: Joi.string().min(7).required().error(new Error("Please provide your password again")),
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
  EmailValidation,
  signupValidation,
  validateExistingUser,
  validateUserLogin,
  authenticateUser,
  resetPasswordValidation,
};
