/**
 * Interface describing database config
 */
export interface DatabaseConfig {
  HOST: string;
  PORT: string;
  USER: string;
  PASSWORD: string;
  DATABASE: string;
};

/**
 * Interface describing default database config
 */
export interface DefaultDatabaseConfig {
  DEFAULT_HOST: string;
  DEFAULT_PORT: string;
  DEFAULT_USER: string;
  DEFAULT_PASSWORD: string;
  DEFAULT_DATABASE: string;
};

/** Interface describing the final config */
export interface Config {
  DB: DatabaseConfig
};
