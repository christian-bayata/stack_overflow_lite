import { Router } from "express";
import esController from "../controllers/esRequests";

const esRouter = Router();

esRouter.post("/create-index", esController.createESIndex);

esRouter.post("/create-user", esController.esCreateUsers);

esRouter.get("/search-user-name", esController.esSearchUserByName);

esRouter.post("/create-question", esController.esCreateQuestion);

esRouter.get("/search-question", esController.esSearchQuestion);

export default esRouter;
