import { Router } from "express";
import usersRouter from "./users";
import questionsRouter from "./questions";
import answersRouter from "./answers";

const router = Router();

router.use("/users", usersRouter);
router.use("/questions", questionsRouter);
router.use("/answers", answersRouter);

export default router;
