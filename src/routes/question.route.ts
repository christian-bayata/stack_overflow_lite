import { Router } from "express";
import usersMiddlewares from "../middlewares/user.middleware";
import questionsController from "../controllers/question.controller";
import questionsMiddleware from "../middlewares/question.middleware";

const questionsRouter = Router();

questionsRouter.post("/create", usersMiddlewares.authenticateUser, questionsMiddleware.validateCreateQuestion, questionsController.create);

questionsRouter.post("/count-question-views", questionsController.questionsViews);

questionsRouter.post("/vote-question", usersMiddlewares.authenticateUser, questionsController.questionsVotes);

questionsRouter.patch("/update-question", usersMiddlewares.authenticateUser, questionsController.updateQuestion);

export default questionsRouter;
