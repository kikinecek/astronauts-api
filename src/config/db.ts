import { DatabaseConfig, DefaultDatabaseConfig } from "../types/config";

/**
 * Config with default values that are used in the case that the value are missing in environment variables
 */
const defaultConfig: DefaultDatabaseConfig = {
  DEFAULT_HOST: 'host',
  DEFAULT_PORT: "3333",
  DEFAULT_USER: 'root',
  DEFAULT_PASSWORD: '',
  DEFAULT_DATABASE: 'astronauts'
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
  HOST: MYSQL_DB_HOST || defaultConfig.DEFAULT_HOST,
  PORT: MYSQL_DB_PORT || defaultConfig.DEFAULT_PORT,
  USER: MYSQL_DB_USER || defaultConfig.DEFAULT_USER,
  PASSWORD: MYSQL_DB_PASSWORD || defaultConfig.DEFAULT_PASSWORD,
  DATABASE: MYSQL_DB_DATABASE || defaultConfig.DEFAULT_DATABASE
};

export default config;