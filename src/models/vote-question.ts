"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface VoteQuestionAttributes {
  id: number;
  questionId: number;
  userId: number;
}

export interface VoteQuestionInput extends Optional<VoteQuestionAttributes, "id" | "questionId" | "userId"> {}

export interface VoteQuestionOutput extends Required<VoteQuestionAttributes> {}

class VoteQuestion extends Model<VoteQuestionAttributes, VoteQuestionInput> implements VoteQuestionAttributes {
  public id: number;
  public questionId: number;
  public userId: number;
}

VoteQuestion.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    paranoid: false,
  }
);

export default VoteQuestion;
