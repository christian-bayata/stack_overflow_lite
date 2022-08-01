"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/config";

interface PasswordTokenAttributes {
  id: string;
  email: string;
  token: string;
}

export interface PasswordTokenInput extends Optional<PasswordTokenAttributes, "id"> {}

export interface PasswordTokenOutput extends Required<PasswordTokenAttributes> {}

class PasswordToken extends Model<PasswordTokenAttributes, PasswordTokenInput> implements PasswordTokenAttributes {
  public id!: string;
  public email!: string;
  public token!: string;

  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;

  static associate(models: any) {
    // define association here
    PasswordToken.belongsTo(models.User, {
      foreignKey: "userId",
    });
  }
}

PasswordToken.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default PasswordToken;
