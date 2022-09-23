import { Router } from "express";
import usersMiddleware from "../middlewares/users";
import usersController from "../controllers/users";

const usersRouter = Router();

usersRouter.post("/get-verification-code", usersMiddleware.EmailValidation, usersController.getVerificationCode);

usersRouter.post("/signup", usersMiddleware.signupValidation, usersMiddleware.validateExistingUser, usersController.signup);

usersRouter.post("/login", usersMiddleware.validateUserLogin, usersMiddleware.validateUserLogin, usersController.login);

usersRouter.post("/forgot-password", usersMiddleware.EmailValidation, usersController.forgotPassword);

usersRouter.post("/password/reset/:token", usersMiddleware.resetPasswordValidation, usersController.resetPassword);

export default usersRouter;
