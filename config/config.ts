require("dotenv").config();
import { Dialect, Model, Sequelize } from "sequelize";

const isTest = process.env.NODE_ENV === "test";

const dbName = isTest ? (process.env.TEST_DB_NAME as string) : (process.env.DB_NAME as string);
const dbUser = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD as string;
const dbPort = process.env.DB_PORT as string;

const URI = `${dbDriver}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const sequelizeConnection = new Sequelize(URI, {
  host: "mysql",
  dialect: "mysql",
});

sequelizeConnection
  .authenticate()
  .then(() => {
    console.log("DB connection established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to DB", err);
  });

export default sequelizeConnection;
