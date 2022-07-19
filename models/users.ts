"use strict";
import { Model } from "sequelize";

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

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    reputation!: number;
    phone: string;
    address!: string;
    city!: string;
    state!: string;
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
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
