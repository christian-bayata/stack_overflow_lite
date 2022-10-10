import { Router } from "express";
import userMiddleware from "../middlewares/user.middleware";
import answerController from "../controllers/answer.controller";
import answerMiddleware from "../middlewares/answer.middleware";

const answersRouter = Router();

answersRouter.post("/create", userMiddleware.authenticateUser, answerMiddleware.validateCreateAnswer, answerController.create);

answersRouter.post("/count-answer-views", answerMiddleware.validateAnswer, answerController.answersViews);

answersRouter.post("/vote-answer", userMiddleware.authenticateUser, answerController.answersVotes);

answersRouter.patch("/update-answer", userMiddleware.authenticateUser, answerController.updateAnswer);

export default answersRouter;
