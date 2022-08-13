"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface VoteAnswerAttributes {
  id: number;
  answerId: number;
  userId: number;
}

export interface VoteAnswerInput extends Optional<VoteAnswerAttributes, "id" | "answerId" | "userId"> {}

export interface VoteAnswerOutput extends Required<VoteAnswerAttributes> {}

class VoteAnswer extends Model<VoteAnswerAttributes, VoteAnswerInput> implements VoteAnswerAttributes {
  public id: number;
  public answerId: number;
  public userId: number;
}

VoteAnswer.init(
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
    answerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default VoteAnswer;
