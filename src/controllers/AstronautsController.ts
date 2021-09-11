import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connect, transaction } from "../db";
import AstronautsDbApi from "../DbApi/AstronautsDbApi";
import {
  AstronautDeserialized,
  AstronautInMemory,

  AstronautSerialized,

  transformAstronautSerializedToDeserialized
} from "../types/astronaut";
import { AstronautFormValidator } from "../validation/AstronautValidator";

/**
 * Class is used as controller for astronaut endpoints
 */
class AstronautsController {
  /**
   * Method is endpoint for fetching all (not deleted) astronauts
   * @param req is http request
   * @param res is http response
   */
  public static async getAstronauts(req: Request, res: Response, next: NextFunction) {
    try {
      const astronauts = await connect(async (connection) =>
        await AstronautsDbApi.getAstronauts(connection)
      );

      res.status(StatusCodes.OK).json(astronauts);
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  /**
   * Method is endpoint for fetching astronaut by it's id
   * @param req is http request
   * @param res is http response
   */
  public static async getAstronautById(req: Request, res: Response, next: NextFunction) {
    const astronautId: number = parseInt(req.params.astronautId);

    try {
      const astronaut: AstronautInMemory = await connect(async (connection) =>
        await AstronautsDbApi.getAstronautById(
          connection,
          astronautId
        )
      )

      res.status(StatusCodes.OK).json(astronaut);
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  /**
   * Method is end point for creating new astronaut
   * @param req is http request
   * @param res is http response
   */
  public static async createAstronaut(req: Request, res: Response, next: NextFunction) {
    // get astronaut data from request
    const astronautSerialized: AstronautSerialized = req.body;
    try {
      // validate astronauts data with JOI
      await AstronautFormValidator.validateAsync(astronautSerialized);

      const astronaut: AstronautDeserialized =
        transformAstronautSerializedToDeserialized(astronautSerialized);

      await connect(async (connection) => {
        await transaction(connection, async () => {
          await AstronautsDbApi.createAstronaut(connection, astronaut);
        });
      });

      res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  /**
   * Method is end point for updating astronaut
   * @param req is http request
   * @param res is http response
   */
  public static async updateAstronaut(req: Request, res: Response, next: NextFunction) {
    const astronautId: number = parseInt(req.params.astronautId);

    // get astronaut data from request
    const astronautSerialized: AstronautSerialized = req.body;

    try {
      // validate astronauts data with JOI
      await AstronautFormValidator.validateAsync(astronautSerialized);

      const astronaut: AstronautDeserialized =
        transformAstronautSerializedToDeserialized(astronautSerialized);

      await connect(async (connection) => {
        await transaction(connection, async () => {
          await AstronautsDbApi.updateAstronaut(
            connection,
            astronautId,
            astronaut
          )
        })
      })
      res.status(StatusCodes.OK).send();
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  /**
   * Method is end point for deleting astronaut by it's id
   * @param req is http request
   * @param res is http response
   */
  public static async deleteAstronaut(req: Request, res: Response, next: NextFunction) {
    try {
      const astronautId: number = parseInt(req.params.astronautId);

      await connect(async (connection) =>
        await AstronautsDbApi.deleteAstronautById(
          connection,
          astronautId
        )
      );

      res.status(StatusCodes.OK).send();
    } catch (err) {
      console.log(err);

      next(err);
    }
  }
};

export default AstronautsController;