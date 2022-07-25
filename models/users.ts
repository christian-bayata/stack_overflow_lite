"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  reputation: number;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface UserInput extends Optional<UserAttributes, "id" | "reputation" | "address"> {}

export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public reputation: number;
  public phone!: string;
  public address: string;
  public city!: string;
  public state!: string;

  static associate(models: any) {
    // define association here
    User.hasMany(models.Question, {
      foreignKey: "userId",
      as: "user_questions",
    });

    User.hasMany(models.Answer, {
      foreignKey: "userId",
      as: "user_answers",
    });

    User.belongsToMany(models.Question, {
      through: "Subscription",
      as: "questions_subscriptions",
      foreignKey: "userId",
      otherKey: "questionId",
    });
  }
}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reputation: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default User;
