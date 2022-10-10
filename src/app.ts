import express, { Application, Request, Response } from "express";
const port = process.env.PORT || 7000;
//import dbInit from "./config/init";
import router from "./routes/index.route";
import ResponseHandler from "./utils/responseHandler.utils";

/* connect to the database */
//dbInit();

export const setup = () => {
  const app: Application = express();

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health-check", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: "Welcome to stack overflow lite API!" });
  });

  app.use("/api", router);

  // Error Handler middleware
  app.use((error: any, res: Response) => {
    return ResponseHandler.fatalError({ res, error });
  });

  return app;
};

export const start = () => {
  const server = setup();
  try {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error: any) {
    console.log(`Error occurred: ${error.message}`);
  }
  return server;
};

start();
