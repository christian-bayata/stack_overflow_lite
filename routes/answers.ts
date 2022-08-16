import { Router } from "express";
import usersMiddlewares from "../middlewares/users";
import answersController from "../controllers/answers";
import answersMiddlewares from "../middlewares/answers";

const answersRouter = Router();

answersRouter.post("/create", usersMiddlewares.authenticateUser, answersMiddlewares.validateCreateAnswer, answersController.create);

answersRouter.post("/count-answer-views", answersMiddlewares.validateAnswer, answersController.answersViews);

answersRouter.post("/vote-answer", usersMiddlewares.authenticateUser, answersController.answersVotes);

export default answersRouter;
