import models from "../models/index";
import { Transaction } from "sequelize";
import sequelize from "../config/config";
import { VerificationCodeDto } from "../extensions/dto/codes.dto";
import { UserSignUpDto } from "../extensions/dto/users.dto";

const findUserEmailAndPhone = async (where: any) => {
  return await models.User.findOne({ where });
};

const findEmail = async (where: any): Promise<UserSignUpDto | null> => {
  return await models.User.findOne({ where });
};

const findVerCodeAndEmail = async (where: any): Promise<VerificationCodeDto | null> => {
  return await models.Code.findOne({ where });
};

const deleteVerCode = async (where: any) => {
  return await models.Code.destroy({ where });
};

const createUserAndDeleteToken = async (data: UserSignUpDto, where: any) => {
  try {
    const createdUserData = await sequelize.transaction(async (t: Transaction) => {
      const theCreatedUser = await models.User.create(data, { transaction: t });
      await models.Code.destroy({ where });

      return theCreatedUser;
    });
    return { createdUserData };
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

const findUser = async (where: any) => {
  return await models.User.findOne({ where });
};

const incOrDecReputation = async (userId: number, flag: string) => {
  return flag == "downvote" ? await models.User.decrement({ reputation: 2 }, { where: { id: userId } }) : await models.User.increment({ reputation: 2 }, { where: { id: userId } });
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
  findUser,
  incOrDecReputation,
};
