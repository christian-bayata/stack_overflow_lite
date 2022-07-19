import { Sequelize } from "sequelize";
import config, { SERVER_PORT } from "./config.js";

const options = {
  dialect: config.development.dialect,
  host: config.development.host,
  port: SERVER_PORT,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
};
const sequelizeConnection = new Sequelize(config.development.database, config.development.username, config.development.password, options);

export default sequelizeConnection;
