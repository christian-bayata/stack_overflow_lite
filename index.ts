import express from "express";
const port = process.env.PORT || 3000;
import db from "./models";

const app = express();

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`App is running on port ${port}`));
});
