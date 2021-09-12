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

/** Interface describing cors config */
export interface CorsConfig {
  ORIGIN: string;
};

/** Interface describing app config */
export interface AppConfig {
  PORT: string;
}

/** Interface describing the final config */
export interface Config {
  DB: DatabaseConfig,
  CORS: CorsConfig,
  APP: AppConfig
};