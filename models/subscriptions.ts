"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface SubscriptionAttributes {
  id: number;
  questionId: number;
  userId: number;
}

export interface SubscriptionInput extends Optional<SubscriptionAttributes, "id" | "questionId" | "userId"> {}

export interface SubscriptionOutput extends Required<SubscriptionAttributes> {}

class Subscription extends Model<SubscriptionAttributes, SubscriptionInput> implements SubscriptionAttributes {
  public id: number;
  public questionId: number;
  public userId: number;
}

Subscription.init(
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
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default Subscription;
