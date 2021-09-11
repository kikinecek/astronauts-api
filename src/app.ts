import express, { Express, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import router from "./route";
import config from "./config";

/**
 * Function used for start and configure the app
 */
const startApp = () => {
  const app: Express = express();

  // middlewares
  app.use(cors({
    origin: config.CORS.ORIGIN
  }))
  app.use(express.json());
  app.use(router);

  // NOT_FOUND error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    var err = new Error('Not Found');
    res.status(StatusCodes.NOT_FOUND).end();

    next(err);
  });

  // OTHER error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.send({
      message: err.message,
      error: err
    });
  });
  
  app.listen(3001);
}

export default startApp;