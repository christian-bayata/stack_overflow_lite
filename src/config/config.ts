require("dotenv").config();
import { Dialect, Sequelize } from "sequelize";
import models from "../models/index.model";

let sequelize: any;

const isTest = process.env.NODE_ENV === "test";

const dbName = isTest ? (process.env.TEST_DB_NAME as string) : (process.env.DB_NAME as string);
const dbUser = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD as string;
const dbPort = process.env.DB_PORT as string;

const URI = `${dbDriver}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

sequelize = new Sequelize(URI, {
  host: "mysql",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`DB connection established successfully in ${process.env.NODE_ENV} mode`);
  })
  .catch((err: any) => {
    console.log("Unable to connect to DB", err);
  });

// Close sequelize connection
export const sequelizeConnClose: () => Promise<void> = async () => {
  await sequelize.close();
};

export default sequelize;
