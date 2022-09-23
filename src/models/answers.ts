"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface AnswerAttributes {
  id: number;
  answer: string;
  views: number;
  upvotes: number;
  downvotes: number;
  userId: number;
  questionId: number;
}

export interface AnswerInput extends Optional<AnswerAttributes, "id" | "views" | "upvotes" | "downvotes" | "userId"> {}

export interface AnswerOutput extends Required<AnswerAttributes> {}

class Answer extends Model<AnswerAttributes, AnswerInput> implements AnswerAttributes {
  public id!: number;
  public answer!: string;
  public views: number;
  public upvotes: number;
  public downvotes: number;
  public userId!: number;
  public questionId: number;

  static associate(models: any) {
    // define association here
    Answer.hasMany(models.Answer, {
      foreignKey: "answerId",
      as: "question_answers",
    });

    Answer.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user_details",
    });

    Answer.belongsToMany(models.User, {
      through: "Subscription",
      as: "users_subscriptions",
      foreignKey: "answerId",
      otherKey: "userId",
    });

    Answer.belongsToMany(models.User, {
      through: "VoteAnswer",
      as: "voters_details",
      foreignKey: "answerId",
      otherKey: "userId",
    });
  }
}

Answer.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    paranoid: false,
  }
);

export default Answer;
