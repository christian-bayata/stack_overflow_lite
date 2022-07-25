require("dotenv").config();

import { User, Question, Answer, Subscription } from "./models/index";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV !== "test";

const dbInit = () => {
  Promise.all([User.sync({ alter: isDev || isTest }), Question.sync({ alter: isDev || isTest }), Answer.sync({ alter: isDev || isTest }), Subscription.sync({ alter: isDev || isTest })]);
  console.log("Connected to database successfully");
};

export default dbInit;
