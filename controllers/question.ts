import { Request, Response } from "express";
import { AdditionalResponse } from "../extensions/response";
import ResponseHandler from "../utils/responseHandler";
import questionsQueries from "../queries/questions";

const create = async (req: Request, res: AdditionalResponse) => {
  const { question } = req.body;
  const { user } = res;

  try {
    if (!user) return ResponseHandler.badRequest({ res, error: "Unauthenticated user" });

    const theQuestion = await questionsQueries.createQuestion({ question, userId: user.id });

    return res.json({ message: "Question sent successfully ", question: theQuestion });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const getOne = async (req: Request, res: AdditionalResponse) => {
  const { questionId } = req.query;
};

export default {
  create,
};
