import { Router } from "express";
import usersRouter from "./users";
import questionsRouter from "./questions";
import answersRouter from "./answers";
import esRouter from "./esRequests";

const router = Router();

router.use("/users", usersRouter);
router.use("/questions", questionsRouter);
router.use("/answers", answersRouter);
router.use("/es", esRouter);

export default router;
