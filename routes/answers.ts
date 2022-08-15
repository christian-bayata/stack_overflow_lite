import { Router } from "express";
import usersMiddlewares from "../middlewares/users";
import answersController from "../controllers/answers";
import answersMiddleware from "../middlewares/answers";

const answersRouter = Router();

answersRouter.post("/create", usersMiddlewares.authenticateUser, answersMiddleware.validateCreateAnswer, answersController.create);

answersRouter.post("/count-answer-views", answersMiddleware.validateAnswer, answersController.answersViews);

export default answersRouter;
