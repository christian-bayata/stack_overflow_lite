import "express-async-errors";
import { Request, Response, NextFunction } from "express";
import { AdditionalResponse } from "../extensions/response";
import ResponseHandler from "../utils/responseHandler";
import answersQueries from "../queries/answers";
import { publishToQueue } from "../services/rabbitMq";

const create = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { questionId, answer } = req.body;
  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });

  try {
    const theAnswer = questionId && user.id ? await answersQueries.updateAnswer({ answer }, { questionId, userId: user.id }) : await answersQueries.createAnswer({ answer, questionId, userId: user.id });

    /************** Send question and answer to rabbitMQ queue ******************/
    await publishToQueue("QUESTION", { questionId });

    return res.json({ message: "Successfully answered question", theAnswer });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const answersViews = async (req: Request, res: AdditionalResponse) => {
  const { data } = res;
  const { answerId } = req.body;

  try {
    const theAnswer = await answersQueries.findAnswer({ id: answerId });
    if (!theAnswer) return ResponseHandler.notFound({ res, error: "The answer is not available" });

    await answersQueries.countAnswerViews(answerId);

    return res.json({ message: "Answer views have been updated" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

export default {
  create,
  answersViews,
};
