import { Router } from "express";
import userMiddleware from "../middlewares/user.middleware";
import usersController from "../controllers/user.controller";

const usersRouter = Router();

usersRouter.post("/get-verification-code", userMiddleware.EmailValidation, usersController.getVerificationCode);

usersRouter.post("/signup", userMiddleware.signupValidation, userMiddleware.validateExistingUser, usersController.signup);

usersRouter.post("/login", userMiddleware.validateUserLogin, userMiddleware.validateUserLogin, usersController.login);

usersRouter.post("/forgot-password", userMiddleware.EmailValidation, usersController.forgotPassword);

usersRouter.post("/password/reset/:token", userMiddleware.resetPasswordValidation, usersController.resetPassword);

export default usersRouter;
