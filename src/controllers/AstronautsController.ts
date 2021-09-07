import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connect, transaction } from "../db";
import AstronautsDbApi from "../DbApi/AstronautsDbApi";
import {
  AstronautDeserialized,
  AstronautInMemory,

  transformAstronautSerializedToDeserialized
} from "../types/astronaut";

/**
 * Class is used as controller for astronaut endpoints
 */
class AstronautsController {
  /**
   * Method is endpoint for fetching all (not deleted) astronauts
   * @param req is http request
   * @param res is http response
   */
  public static async getAstronauts(req: Request, res: Response) {
    const astronauts = await connect(async (connection) => {
      return await AstronautsDbApi.getAstronauts(connection)
    }
    );

    res.status(StatusCodes.OK).json(astronauts);
  }

  /**
   * Method is endpoint for fetching astronaut by it's id
   * @param req is http request
   * @param res is http response
   */
  public static async getAstronautById(req: Request, res: Response) {
    const astronautId: number = parseInt(req.params.astronautId);
    
    const astronaut: AstronautInMemory = await connect(async (connection) => 
      await AstronautsDbApi.getAstronautById(
        connection,
        astronautId
      )
    )

    res.status(StatusCodes.OK).json(astronaut);
  }

  /**
   * Method is end point for creating new astronaut
   * @param req is http request
   * @param res is http response
   */
  public static async createAstronaut(req: Request, res: Response) {
    const astronaut: AstronautDeserialized = 
      transformAstronautSerializedToDeserialized(req.body.astronaut);

    await connect(async (connection) => {
      await transaction(connection, async () => {
        await AstronautsDbApi.createAstronaut(connection, astronaut);
      });
    });

    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }

  /**
   * Method is end point for updating astronaut
   * @param req is http request
   * @param res is http response
   */
  public static async updateAstronaut(req: Request, res: Response) {
    const astronautId: number = parseInt(req.params.astronautId);
    const astronaut: AstronautDeserialized =
      transformAstronautSerializedToDeserialized(req.body.astronaut);
    
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
  }

  /**
   * Method is end point for deleting astronaut by it's id
   * @param req is http request
   * @param res is http response
   */
  public static async deleteAstronaut(req: Request, res: Response) {
    const astronautId: number = parseInt(req.params.astronautId);

    await connect(async (connection) => 
      await AstronautsDbApi.deleteAstronautById(
        connection,
        astronautId
      )
    );

    res.status(StatusCodes.OK).send();
  }
};

export default AstronautsController;