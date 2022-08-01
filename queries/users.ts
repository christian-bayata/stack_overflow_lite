import models from "../models/index";
import { Transaction } from "sequelize";
import sequelizeConnection from "../config/config";

const findUserEmailAndPhone = async (where: any) => {
  return await models.User.findOne({ where });
};

const findEmail = async (where: any) => {
  return await models.User.findOne({ where });
};

const findVerCodeAndEmail = async (where: any) => {
  return await models.Code.findOne({ where });
};

const deleteVerCode = async (where: any) => {
  return await models.Code.destroy({ where });
};

const createUserAndDeleteToken = async (data: any, where: any) => {
  try {
    await sequelizeConnection.transaction(async (t: Transaction) => {
      await models.User.create(data, { transaction: t });
      await models.Code.destroy({ where });
      return;
    });
  } catch (error: any) {
    return { error };
  }
};

const createVerCode = async (data: any) => {
  return await models.Code.create(data);
};

const createToken = async (data: any) => {
  return await models.PasswordToken.create(data);
};

const findToken = async (where: any) => {
  return await models.PasswordToken.findOne({ where });
};

const updateUserData = async (data: any, where: any) => {
  return await models.User.update(data, { where });
};

const deleteToken = async (where: any) => {
  return await models.PasswordToken.destroy({ where });
};

export default {
  findUserEmailAndPhone,
  findVerCodeAndEmail,
  deleteVerCode,
  createUserAndDeleteToken,
  findEmail,
  createVerCode,
  createToken,
  findToken,
  updateUserData,
  deleteToken,
};
