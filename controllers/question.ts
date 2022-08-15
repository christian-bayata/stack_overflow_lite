import "express-async-errors";
import { Request, Response } from "express";
import { AdditionalResponse } from "../extensions/response";
import ResponseHandler from "../utils/responseHandler";
import questionsQueries from "../queries/questions";
import usersQueries from "../queries/users";
import { publishToQueue } from "../services/rabbitMq";

const create = async (req: Request, res: AdditionalResponse) => {
  const { queueName, question } = req.body;
  const { user } = res;
  if (!user) return ResponseHandler.badRequest({ res, error: "Unauthenticated user" });

  try {
    const theQuestion = await questionsQueries.createQuestion({ question, userId: user.id });

    /************** Send question to rabbitMQ queue ******************/
    await publishToQueue("question_queue", { question });

    return res.json({ message: "Question sent successfully ", question: theQuestion });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const questionsViews = async (req: Request, res: Response) => {
  const { questionId } = req.body;

  try {
    const theQuestion = await questionsQueries.findQuestion({ id: questionId });
    if (!theQuestion) return ResponseHandler.notFound({ res, error: "The question you selected is not available" });

    await questionsQueries.countQuestionViews(questionId);

    return res.json({ message: "Question views have been updated" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const questionsVotes = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { questionId, flag } = req.body;
  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });

  const validFlags = ["upvote", "downvote"];
  if (!validFlags.includes(flag)) return ResponseHandler.badRequest({ res, error: "Invalid flag" });

  try {
    const getQuestion = await questionsQueries.findQuestion({ id: questionId });
    if (!getQuestion) return ResponseHandler.notFound({ res, error: "The question you selected is not available" });

    /***************** Vote Question and impact user reputation ****************/
    const id = getQuestion.userId;
    const [theUserVotes, theUserReputation] = await Promise.all([questionsQueries.voteQuestion({ questionId: questionId, userId: user.id }, questionId, flag), usersQueries.incOrDecReputation(id, flag)]);

    return res.json({ message: "Question voted successfully" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const updateQuestion = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { questionId } = req.query;
  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });

  if (!questionId) return ResponseHandler.badRequest({ res, error: "Please provide the question ID" });

  try {
    const theQuestion = await questionsQueries.findQuestion({ id: questionId });
    if (!theQuestion) return ResponseHandler.notFound({ res, error: "The question you selected is not available" });

    const updateQuestion = await theQuestion.update({ question: req.body.question });

    return res.json({ message: "Successfully updated question", updateQuestion });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

export default {
  create,
  questionsViews,
  questionsVotes,
  updateQuestion,
};
