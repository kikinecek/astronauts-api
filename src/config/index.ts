import { Config } from "../types/config";
import dbConfig from "./db";

/**
 * Config that merges all configs into one
 */
const config: Config = {
  DB: dbConfig
};

export default config;