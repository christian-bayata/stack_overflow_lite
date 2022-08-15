import models from "../models";

const createAnswer = async (data: any) => {
  return await models.Answer.create(data);
};

const updateAnswer = async (data: any, where: any) => {
  return await models.Answer.update(data, { where });
};

const findAnswer = async (where: any) => {
  return await models.Answer.findOne(where);
};

const countAnswerViews = async (answerId: number) => {
  return await models.Answer.increment({ views: 1 }, { where: { id: answerId } });
};

export default {
  createAnswer,
  updateAnswer,
  findAnswer,
  countAnswerViews,
};
