import { Router } from "express";
import usersMiddlewares from "../middlewares/users";
import questionsController from "../controllers/questions";
import questionsMiddleware from "../middlewares/questions";

const questionsRouter = Router();

questionsRouter.post("/create", usersMiddlewares.authenticateUser, questionsMiddleware.validateCreateQuestion, questionsController.create);

questionsRouter.post("/count-question-views", questionsController.questionsViews);

questionsRouter.post("/vote-question", usersMiddlewares.authenticateUser, questionsController.questionsVotes);

questionsRouter.post("/update-question", usersMiddlewares.authenticateUser, questionsController.updateQuestion);

export default questionsRouter;
