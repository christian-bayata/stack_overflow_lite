import models from "../models/index.model";
import sequelize from "../config/config";
import { Transaction } from "sequelize/types";

const createAnswer = async (data: any) => {
  return await models.Answer.create(data);
};

const updateAnswer = async (data: any, where: any) => {
  return await models.Answer.update(data, { where });
};

const findAnswer = async (where: any) => {
  return await models.Answer.findOne({ where });
};

const countAnswerViews = async (answerId: number) => {
  return await models.Answer.increment({ views: 1 }, { where: { id: answerId } });
};

const voteAnswer = async (data: any, answerId: number, flag: string) => {
  try {
    return await sequelize.transaction(async (t: Transaction) => {
      await models.VoteAnswer.create(data, { transaction: t });
      flag == "downvote" ? await models.Answer.increment({ downvotes: 1 }, { where: { id: answerId } }) : await models.Answer.increment({ upvotes: 1 }, { where: { id: answerId } });
    });
  } catch (error) {
    return { error };
  }
};

export default {
  createAnswer,
  updateAnswer,
  findAnswer,
  countAnswerViews,
  voteAnswer,
};
