import { Config } from "../types/config";
import dbConfig from "./db";
import corsConfig from "./cors";
import appConfig from "./app";

/**
 * Config that merges all configs into one
 */
const config: Config = {
  DB: dbConfig,
  CORS: corsConfig,
  APP: appConfig
};

export default config;