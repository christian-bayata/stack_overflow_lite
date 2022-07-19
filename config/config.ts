import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME || (`` as string);
const DB_PASSWORD = process.env.DB_PASSWORD || (`` as string);
const DB_HOST = process.env.DB_HOST || ``;
const DB_NAME = process.env.DB_NAME || ``;
const DIALECT = process.env.DIALECT as Dialect;

export const DEV_DATABASE = `mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?reconnect=true`;
export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3306;

export default {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DIALECT,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DIALECT,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DIALECT,
  },
};
