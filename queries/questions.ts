import models from "../models/index";

const createQuestion = async (data: any) => {
  return await models.Question.create(data);
};

export default {
  createQuestion,
};
