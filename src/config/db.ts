import { DatabaseConfig } from "../types/config";

/**
 * Config with default values that are used in the case that the value are missing in environment variables
 */
const defaultConfig: DatabaseConfig = {
  HOST: 'host',
  PORT: "3333",
  USER: 'root',
  PASSWORD: '',
  DATABASE: 'astronauts'
};

/** All envirnment variables used to configure database */
const {
  MYSQL_DB_HOST,
  MYSQL_DB_PORT,
  MYSQL_DB_USER,
  MYSQL_DB_PASSWORD,
  MYSQL_DB_DATABASE
} = process.env;

/** Database config */
const config: DatabaseConfig = {
  HOST: MYSQL_DB_HOST ?? defaultConfig.HOST,
  PORT: MYSQL_DB_PORT ?? defaultConfig.PORT,
  USER: MYSQL_DB_USER ?? defaultConfig.USER,
  PASSWORD: MYSQL_DB_PASSWORD ?? defaultConfig.PASSWORD,
  DATABASE: MYSQL_DB_DATABASE ?? defaultConfig.DATABASE
};

export default config;