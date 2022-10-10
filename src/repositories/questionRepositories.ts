import { Transaction } from "sequelize/types";
import sequelize from "../config/config";
import models from "../models/index.model";

const createQuestion = async (data: any) => {
  return await models.Question.create(data);
};

const findQuestion = async (where: any) => {
  return await models.Question.findOne(where);
};

const countQuestionViews = async (questionId: number) => {
  return await models.Question.increment({ views: 1 }, { where: { id: questionId } });
};

const voteQuestion = async (data: any, questionId: number, flag: string) => {
  try {
    return await sequelize.transaction(async (t: Transaction) => {
      await models.VoteQuestion.create(data, { transaction: t });
      flag == "downvote" ? await models.Question.increment({ downvotes: 1 }, { where: { id: questionId } }) : await models.Question.increment({ upvotes: 1 }, { where: { id: questionId } });
    });
  } catch (error) {
    return { error };
  }
};

export default {
  createQuestion,
  findQuestion,
  countQuestionViews,
  voteQuestion,
};
