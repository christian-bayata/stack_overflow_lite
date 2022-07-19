"use strict";
import { Model } from "sequelize";

interface AnswerAttributes {
  id: number;
  question: string;
  views: number;
  upvotes: number;
  downvotes: number;
  userId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Answer extends Model<AnswerAttributes> implements AnswerAttributes {
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
      Answer.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user_details",
      });

      Answer.belongsTo(models.Question, {
        foreignKey: "userId",
        as: "question_details",
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
      modelName: "Answer",
    }
  );
  return Answer;
};
