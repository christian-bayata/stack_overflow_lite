"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface QuestionAttributes {
  id: number;
  question: string;
  views: number;
  upvotes: number;
  downvotes: number;
  userId: number;
}

export interface QuestionInput extends Optional<QuestionAttributes, "id" | "views" | "upvotes" | "downvotes" | "userId"> {}

export interface QuestionOutput extends Required<QuestionAttributes> {}

class Question extends Model<QuestionAttributes, QuestionInput> implements QuestionAttributes {
  public id!: number;
  public question!: string;
  public views: number;
  public upvotes: number;
  public downvotes: number;
  public userId!: number;

  static associate(models: any) {
    // define association here
    Question.hasMany(models.Answer, {
      foreignKey: "answerId",
      as: "question_answers",
    });

    Question.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user_details",
    });

    Question.belongsToMany(models.User, {
      through: "Subscription",
      as: "users_subscriptions",
      foreignKey: "questionId",
      otherKey: "userId",
    });

    Question.belongsToMany(models.User, {
      through: "VoteQuestion",
      as: "voters-details",
      foreignKey: "questionId",
      otherKey: "userId",
    });
  }
}

Question.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    question: {
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

export default Question;
