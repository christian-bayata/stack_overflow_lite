require("dotenv").config();

import models from "../models/index";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV !== "test";

const dbInit = () => {
  Promise.all([models.User.sync({ alter: isDev || isTest }), models.Question.sync({ alter: isDev || isTest }), models.Answer.sync({ alter: isDev || isTest }), models.Subscription.sync({ alter: isDev || isTest })]);
  console.log("Connected to database successfully");
};

export default dbInit;
