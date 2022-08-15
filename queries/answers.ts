import models from "../models";

const createAnswer = async (data: any) => {
  return await models.Answer.create(data);
};

const updateAnswer = async (data: any, where: any) => {
  return await models.Answer.update(data, { where });
};

export default {
  createAnswer,
  updateAnswer,
};
