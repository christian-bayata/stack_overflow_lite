import "express-async-errors";
import { Request, Response, NextFunction } from "express";
import { AdditionalResponse } from "../interfaces/response.interface";
import ResponseHandler from "../utils/responseHandler";
import answersQueries from "../queries/answers";
import { publishToQueue } from "../services/rabbitMq";
import usersQueries from "../queries/users";
import questionsQueries from "../queries/questions";

const create = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { questionId, answer } = req.body;
  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });

  try {
    const theAnswer = questionId && user.id ? await answersQueries.updateAnswer({ answer }, { questionId, userId: user.id }) : await answersQueries.createAnswer({ answer, questionId, userId: user.id });

    /************** Send question and answer to rabbitMQ queue ******************/
    await publishToQueue("QUESTION", { questionId });

    return ResponseHandler.success({ res, message: "Successfully answered question", data: theAnswer });
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

    return ResponseHandler.success({ res, message: "Answer views have been updated" });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const answersVotes = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { answerId, flag } = req.body;

  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });

  if (!flag || !answerId) return ResponseHandler.unAuthorized({ res, error: "Please provide your flag or answer ID" });

  const validFlags = ["upvote", "downvote"];
  if (!validFlags.includes(flag)) return ResponseHandler.badRequest({ res, error: "Invalid flag" });

  try {
    const getAnswer = await answersQueries.findAnswer({ id: answerId });
    if (!getAnswer) return ResponseHandler.notFound({ res, error: "The question you selected is not available" });

    /***************** Vote Answer and impact user reputation ****************/
    const answererId = getAnswer.userId;
    const voterId = user.id;

    /* Vote answer */
    /* Reduce reputation of answerer based on votes - either downvotes or upvotes */
    /* Reduce the reputation of the voter by 1 */
    const [theUserVotes, theUserReputation] = await Promise.all([answersQueries.voteAnswer({ answerId: answerId, userId: user.id }, answerId, flag), usersQueries.incOrDecReputation(answererId, flag), user.decrement({ reputation: 1 }, { where: { id: voterId } })]);

    return ResponseHandler.success({ res, message: "Answer has been successfully updated." });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

const updateAnswer = async (req: Request, res: AdditionalResponse) => {
  const { user } = res;
  const { answerId } = req.query;

  if (!user) return ResponseHandler.unAuthorized({ res, error: "Unauthenticated user" });
  if (!answerId) return ResponseHandler.badRequest({ res, error: "Please provide the answer ID" });

  try {
    const getAnswer = await answersQueries.findAnswer({ id: answerId });
    if (!getAnswer) return ResponseHandler.notFound({ res, error: "The answer you selected is not available" });

    const updateAnswer = await getAnswer.update({ answer: req.body.answer });

    return ResponseHandler.success({ res, message: "Successfully updated answer", data: updateAnswer });
  } catch (error) {
    console.log(error);
    return ResponseHandler.fatalError({ res });
  }
};

export default {
  create,
  answersViews,
  answersVotes,
  updateAnswer,
};
