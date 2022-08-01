"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface AnswerAttributes {
  id: string;
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
  public id!: string;
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
      foreignKey: "questionId",
      otherKey: "userId",
    });
  }
}

Answer.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default Answer;
