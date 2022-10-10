import { Router } from "express";
import usersRouter from "./user.route";
import questionsRouter from "./question.route";
import answersRouter from "./answer.route";
import esRouter from "./esRequest.route";

const router = Router();

router.use("/users", usersRouter);
router.use("/questions", questionsRouter);
router.use("/answers", answersRouter);
router.use("/es", esRouter);

export default router;
