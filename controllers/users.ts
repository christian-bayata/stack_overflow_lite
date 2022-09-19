import { Request, Response } from "express";
import { AdditionalResponse } from "../extensions/response";
import usersQueries from "../queries/users";
import ResponseHandler from "../utils/responseHandler";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import helper from "../utils/helper";
import { sendEmail } from "../utils/sendMail";
import { buildResponseOutput } from "../interfaces/response.interface";
import { UserSignUpDto } from "../extensions/dto/users.dto";

/**
 * @Title User verification code
 * @Param req
 * @Param res
 * @Returns Returns the verification code of the user
 *
 */
const getVerificationCode = async (req: Request, res: AdditionalResponse) => {
  const { data } = res;
  const { email } = req.body;

  try {
    // Check if user with this email already exists;
    const confirmEmail = await usersQueries.findEmail({ email });
    if (confirmEmail) return ResponseHandler.badRequest({ res, error: "You already have an account with us" });

    const verCodeData = { email, code: crypto.randomBytes(3).toString("hex").toUpperCase() };
    const userCode = await usersQueries.createVerCode(verCodeData);

    return ResponseHandler.success({ res, message: "Code successfully sent", data: userCode });
  } catch (error) {
    return ResponseHandler.fatalError({ res });
  }
};

/**
 * @Title User sign up
 * @Param req
 * @Param res
 * @Returns Returns the created user details
 *
 */
const signup = async (req: Request, res: AdditionalResponse) => {
  const { data, user } = res;

  const confirmVerCode = await usersQueries.findVerCodeAndEmail({ email: data.email, code: data.verCode });
  if (!confirmVerCode) {
    return ResponseHandler.badRequest({ res, error: "Invalid verification code or email" });
  }

  // Ensure that a user cannot use the verification code after 30 minutes
  const timeDiff = Number(Date.now() - confirmVerCode.createdAt.getTime());
  const timeDiffInMins = Number(timeDiff / (1000 * 60));

  if (timeDiffInMins > 30) {
    await usersQueries.deleteVerCode({ email: data.email, code: data.verCode });
    return ResponseHandler.badRequest({ res, error: "The verification code has expired, please request another one." });
  }

  try {
    // Create user account and delete verification code
    const { createdUserData, error } = await usersQueries.createUserAndDeleteToken(data, { email: data.email, code: data.verCode });

    if (error) return ResponseHandler.badRequest({ res, error: "Could neither sign up new user nor delete token." });
    // return res.json({ createdUserData });
    return ResponseHandler.created({ res, message: "User scuccessfully created", data: createdUserData });
  } catch (error) {
    //console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

/**
 * @Title User Login
 * @Param req
 * @Param res
 * @Returns Returns the user login details
 *
 */
const login = async (req: Request, res: AdditionalResponse) => {
  const { data } = res;

  try {
    const userExists = await usersQueries.findEmail({ email: data.email });
    if (!userExists) return ResponseHandler.badRequest({ res, error: "Sorry, you do not have an account with us" });

    /* validate user password with bcrypt */
    const validPassword = bcrypt.compareSync(data.password, userExists.password);
    if (!validPassword) return ResponseHandler.unAuthorized({ res, error: "Incorrect Password! Unauthorized" });

    /* Generate JWT token for user */
    const token = jwt.sign({ email: userExists.email, id: userExists.id }, process.env.JWT_SECRET as string, {
      expiresIn: "9999 years",
    });

    /* Format and hash user data for security*/
    const protectedData = helper.formatUserData(data);

    return ResponseHandler.success({ res, message: "User scuccessfully Logged in", data: protectedData });
  } catch (error) {
    return ResponseHandler.fatalError({ res });
  }
};

/**
 * @Title Forgot Password
 * @Param req
 * @Param res
 *
 */
const forgotPassword = async (req: Request, res: AdditionalResponse) => {
  const { data } = res;
  const { email } = req.body;

  try {
    const userExists = await usersQueries.findEmail({ email });
    if (!userExists) return ResponseHandler.badRequest({ res, error: "Sorry, you do not have an account with us" });

    /* Send password token to user email */
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const generateResetToken = await usersQueries.createToken({ email, token });

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${generateResetToken.token}`;

    //Set the password reset email message for client
    const message = `This is your password reset token: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

    //The reset token email
    await sendEmail({ email: userExists.email, subject: "Password Recovery", message });

    return ResponseHandler.success({ res, message: "Password token successfully sent" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const resetPassword = async (req: Request, res: AdditionalResponse) => {
  const { data } = res;
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const userToken = await usersQueries.findToken({ token });
    if (!userToken) return ResponseHandler.badRequest({ res, error: "Invalid token" });

    /* Confirm if the passwords are the same */
    if (confirmPassword !== password) return ResponseHandler.badRequest({ res, error: "Passwords do not match" });

    /* Update user password */
    const getUser = await usersQueries.findEmail({ email: userToken.email });

    const [updatePassword, deleteToken] = await Promise.all([await usersQueries.updateUserData({ password: bcrypt.hashSync(password, 10) }, { password }), await usersQueries.deleteToken({ token: userToken?.token })]);

    return ResponseHandler.success({ res, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

export default {
  getVerificationCode,
  signup,
  login,
  forgotPassword,
  resetPassword,
};
