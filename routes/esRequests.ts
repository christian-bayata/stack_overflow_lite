import { Router } from "express";
import esController from "../controllers/esRequests";

const esRouter = Router();

esRouter.post("/create-index", esController.createESIndex);

esRouter.post("/create-user", esController.esCreateUsers);

esRouter.get("/search-user-name", esController.esSearchUserByName);

export default esRouter;
