import { PoolConnection, Pool, createPool } from "mysql";
import config from "./config";

/** Databse pool */
export const dbPool: Pool = createPool({
  host: config.DB.HOST,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.DATABASE
});

/**
 * Function gets new connection from the pool
 * @returns connection from the pool
 */
export const getConnection = (): Promise<PoolConnection> => (
  new Promise((resolve, reject) => (
    dbPool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }

      resolve(connection);
    })
  ))
);

/**
 * Function gets connection from the pool and executes custom function
 * passing the connection in it
 * @param customFunction is the function that will be executed with passed connection
 * @returns anything that the custom functon returns
 * @throws error when custom function throws error
 */
export const connect = async (customFunction: (connection: PoolConnection) => Promise<any>): Promise<any> => {
  // get connection from the puol
  const connection: PoolConnection = await getConnection();

  // custom function result
  let result: any;

  try{
    // execute the custom function
    result = await customFunction(connection);
  } catch (err) {
    // release connection in the case of error
    connection.release();
    throw err;
  }

  // release connection and return the result
  connection.release();
  return result;
};

/**
 * Function creates transaction on the given connection and executes custom function
 * @param connection that transaction is created on
 * @param customFunction that is executed inside the transaction
 * @returns anything that custom function returns
 * @throws error when custom function throws error
 */
export const transaction = async (
  connection: PoolConnection,
  customFunction: () => Promise<any>
) => {
  // start the transaction
  connection.beginTransaction();

  // result of the custom function
  let result: any;

  try {
    // executing the custom function
    result = await customFunction();
  } catch (err) {
    // in the case function has error, the the rollback
    connection.rollback();
    throw err;
  }

  // commit changes and return result of the custom function
  connection.commit();
  return result;
};

/**
 * Function uses connection to execute custom query with custom data
 * @param connection that is used for the query
 * @param sqlQuery is the executed query
 * @param data are used in custom query
 * @returns result of the custom query (array of the records or object with insert data)
 */
export const query = (
  connection: PoolConnection,
  sqlQuery: string,
  data?: Array<any> | Object
): Promise<any> => (
  new Promise((resolve, reject) => {
    connection.query(sqlQuery, data, (err, results) => {
      if (err) {
        reject(err);
      };

      resolve(results);
    })
  })
)