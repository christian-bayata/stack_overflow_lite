"use strict";
import { Model } from "sequelize";

interface QuestionAttributes {
  id: number;
  question: string;
  views: number;
  upvotes: number;
  downvotes: number;
  userId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Question extends Model<QuestionAttributes> implements QuestionAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    id!: number;
    question!: string;
    views: number;
    upvotes: number;
    downvotes: number;
    userId!: number;
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
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
