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
    /************** Send question and answer to rabbitMQ queue ******************/
    await publishToQueue("question_queue", { questionId });

    const theAnswer = await answersQueries.createAnswer({ answer, questionId });

    return res.json({ theAnswer });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

export default {
  create,
};
