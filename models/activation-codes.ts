"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface CodeAttributes {
  id: number;
  email: string;
  code: string;
}

export interface CodeInput extends Optional<CodeAttributes, "id"> {}

export interface CodeOutput extends Required<CodeAttributes> {}

class Code extends Model<CodeAttributes, CodeInput> implements CodeAttributes {
  public id!: number;
  public email!: string;
  public code!: string;

  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;

  static associate(models: any) {
    // define association here
    Code.hasMany(models.User, {
      foreignKey: "userId",
    });
  }
}

Code.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default Code;
