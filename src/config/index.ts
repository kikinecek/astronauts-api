import { Config } from "../types/config";
import dbConfig from "./db";
import corsConfig from "./cors";

/**
 * Config that merges all configs into one
 */
const config: Config = {
  DB: dbConfig,
  CORS: corsConfig
};

export default config;