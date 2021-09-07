import { PoolConnection } from "mysql";
import { query } from "../db";

import {
  AstronautDb,
  AstronautInMemory,
  AstronautDeserialized,

  transformAstronautDbToInMemory,
  transformAstronautInMemoryToDeserialized
} from "../types/astronaut";

/**
 * Class is used as db api for astronauts
 * This class allows to work with astronauts in the DB.
 */
class AstronautsDbApi {
  /**
   * Method creates astronaut snapshot and returns id of the snapshot
   * @param connection on which query will be executed
   * @param astronautId is used to link snapshot to the astronaut record
   * @param astronautData are data describing the astronaut
   * @returns id of the snapshot
   */
  private static async createAstronautSnapshot(
    connection: PoolConnection,
    astronautId: number,
    astronautData: AstronautDeserialized,
    deleteAstronaut: boolean = false
  ): Promise<number> {
    const { insertId: astronautSnapshotId } = await query(
      connection,
      "INSERT INTO astronaut_snapshot SET ?",
      {
        ...astronautData,
        astronaut_id: astronautId,
        is_deleted: deleteAstronaut
      }
    )

    return astronautSnapshotId;
  }

  /**
   * Method expires astronaut snapshot(s). Technically all unexpired snapshots
   * but since there is always only 1 unexpired - only 1 expires
   * @param connection on which is query executed 
   * @param astronautId is id of the astronauts whichs snapshots will be expired
   */
  private static async expireAstronautSnapshot(
    connection: PoolConnection,
    astronautId: number
  ): Promise<void> {
    await query(
      connection,
      "UPDATE astronaut_snapshot SET expired_at = UTC_TIMESTAMP WHERE astronaut_id = ?",
      [ astronautId ]
    )
  }

  /**
   * Method created the whole astronaut (both records - astronaut and the snapshot)
   * @param connection on which query will be executed
   * @param astronautData are data describing the astronaut
   * @returns id of the new astronaut
   */
  public static async createAstronaut(
    connection: PoolConnection,
    astronautData: AstronautDeserialized
  ): Promise<number> {
    // create astronaut record
    const { insertId: astronautId } = await query(
      connection,
      "INSERT INTO astronaut VALUES ()",
    );

    // create astronaut snapshot record
    await AstronautsDbApi.createAstronautSnapshot(
      connection,
      astronautId,
      astronautData
    );

    // return new record id
    return astronautId;
  }

  /**
   * Method updates astronaut (expires it's last snapshot and creates new one)
   * @param connection on which query is executed
   * @param astronautId is id of the updated astronaut
   * @param astronautData are new data of the astronaut
   */
  public static async updateAstronaut(
    connection: PoolConnection,
    astronautId: number,
    astronautData: AstronautDeserialized,
    deleteAstronaut: boolean = false
  ): Promise<void> {
    // expire the last snapshot
    await AstronautsDbApi.expireAstronautSnapshot(
      connection,
      astronautId
    );

    // create new astronaut snapshot with new data
    await AstronautsDbApi.createAstronautSnapshot(
      connection,
      astronautId,
      astronautData,
      deleteAstronaut
    );
  }

  /**
   * Method finds astronaut in db by gived id.
   * @param connection on whichs query is executed
   * @param astronautId id of wanted astronaut
   * @returns astronaut in InMemory type
   * @throws error when no astronaut is found
   */
  public static async getAstronautById(
    connection: PoolConnection,
    astronautId: number
  ): Promise<AstronautInMemory> {
    // find the astronaut
    const [ result ]: [ AstronautDb ] = await query(
      connection,
      `
        SELECT
          a.id AS id,
          a.created_at AS createdAt,
          a_s.name AS name,
          a_s.surname AS surname,
          a_s.birthdate AS birthdate,
          a_s.superpower AS superpower,
          a_s.created_at AS updatedAt,
          a_s.is_deleted AS isDeleted
        FROM astronaut a
        JOIN astronaut_snapshot a_s
          ON  a_s.astronaut_id = a.id
          AND a_s.is_deleted IS FALSE
          AND a_s.expired_at IS NULL
        WHERE a.id = ?
      `,
      [ astronautId ]
    );

    // if astronaut is not found throw error
    if (!result) {
      throw new Error(`Astronaut with ID: ${astronautId} has not been found!`);
    }

    // transform astronaut data to the InMemory format and return it
    return transformAstronautDbToInMemory(result);
  }

  /**
   * Method finds all astronauts that are not deleted
   * @param connection on whichs query is executed
   * @returns array of astronauts
   */
  public static async getAstronauts(
    connection: PoolConnection
  ): Promise<AstronautInMemory[]> {
    const result = await query(
      connection,
      `
        SELECT
          a.id AS id,
          a.created_at AS createdAt,
          a_s.name AS name,
          a_s.surname AS surname,
          a_s.birthdate AS birthdate,
          a_s.superpower AS superpower,
          a_s.created_at AS updatedAt,
          a_s.is_deleted AS isDeleted
        FROM astronaut a
        JOIN astronaut_snapshot a_s
          ON  a_s.astronaut_id = a.id
          AND a_s.expired_at IS NULL
          AND a_s.is_deleted IS FALSE
      `
    )

    return result.map(transformAstronautDbToInMemory);
  }

  /**
   * Method deletes astronaut (updates astronaut with is_deleted flag as true)
   * @param connection on whichs query is executed
   * @param astronautId is id of astronaut that's going to be deleted
   */
  public static async deleteAstronautById(
    connection: PoolConnection,
    astronautId: number
  ): Promise<void> {
    const oldData: AstronautInMemory = await AstronautsDbApi.getAstronautById(
      connection,
      astronautId
    );

    await AstronautsDbApi.updateAstronaut(
      connection,
      astronautId,
      transformAstronautInMemoryToDeserialized(oldData),
      true
    )
  }
};

export default AstronautsDbApi;