import express, { Application, Request, Response } from "express";
const port = process.env.PORT || 3000;
import dbInit from "./config/init";
import router from "./routes/index";
import ErrorHandler from "./utils/errorHandler";

/* connect to the database */
dbInit();

export const setupExpress = () => {
  const app: Application = express();

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health-check", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: "Welcome to stack overflow lite API!" });
  });

  app.use("/api/v1", router);

  // Error Handler middleware
  app.use((error: any, res: Response) => {
    return ErrorHandler.fatalError({ res, error });
  });

  return app;
};

export const startExpress = () => {
  const server = setupExpress();
  try {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error: any) {
    console.log(`Error occurred: ${error.message}`);
  }
};

startExpress();
