import models from "../models";

const createAnswer = async (data: any) => {
  return await models.User.create(data);
};

export default {
  createAnswer,
};
