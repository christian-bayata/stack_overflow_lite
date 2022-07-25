import { Router } from "express";
import usersRouter from "./users";
import questionsRouter from "./users";
import answersRouter from "./users";

const router = Router();

router.use("/users", usersRouter);
router.use("/questions", questionsRouter);
router.use("/answers", answersRouter);

export default router;
