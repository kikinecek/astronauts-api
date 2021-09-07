/** Interface represents core data for astronaut */
export interface AstronautCore {
  name: string;
  surname: string;
  superpower: string;
};

/**
 * Interface extends AstronautCore by birthdate in serialized format.
 * For example data in this format comes from http message
 */
export interface AstronautSerialized extends AstronautCore {
  birthdate: string;
};

/**
 * Interface extends Astronautcore by birthdate in deserialized format.
 * This format is used to create/update astronaut
 */
export interface AstronautDeserialized extends AstronautCore {
  birthdate: Date;
};

/** Interface represents data that came from DB */
export interface AstronautDb extends AstronautSerialized {
  id: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

/**
 * Interface represents data that came from DB and are transformed into more usable data
 * e.g. dates have type Date 
 */
export interface AstronautInMemory extends AstronautDeserialized {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

/**
 * Function transfroms astronaut in DB format into InMemory format
 * @param astronaut are data to be transformaed
 * @returns transformed astronaut (InMemory format)
 */
export const transformAstronautDbToInMemory = (
  astronaut: AstronautDb
): AstronautInMemory => ({
  ...astronaut,
  birthdate: new Date(astronaut.birthdate),
  createdAt: new Date(astronaut.createdAt),
  updatedAt: new Date(astronaut.updatedAt)
})

/**
 * Function transforms astronaut from format Serialized to Deserialized
 * @param astronaut are data in Serialized format
 * @returns data in Deserialized format
 */
export const transformAstronautSerializedToDeserialized = (
  astronaut: AstronautSerialized
): AstronautDeserialized => ({
  ...astronaut,
  birthdate: new Date(astronaut.birthdate)
});


/**
 * Function transforms astronaut from format InMemory to Deserialized
 * @param astronaut are data in InMemory format
 * @returns data in Deserialized format
 */
export const transformAstronautInMemoryToDeserialized = (
  astronaut: AstronautInMemory
): AstronautDeserialized => ({
  name: astronaut.name,
  surname: astronaut.surname,
  superpower: astronaut.superpower,
  birthdate: astronaut.birthdate
});