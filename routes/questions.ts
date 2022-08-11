import { Router } from "express";
import usersMiddlewares from "../middlewares/users";
import questionsController from "../controllers/question";

const questionsRouter = Router();

questionsRouter.post("/create", usersMiddlewares.authenticateUser, questionsController.create);

export default questionsRouter;
