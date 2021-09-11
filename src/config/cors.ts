import { CorsConfig, DefaultCorsConfig } from "../types/config";

/** Default config for CORS */
const defaultCorsConfig: DefaultCorsConfig = {
  DEFAULT_ORIGIN: "http://localhost:3000"
}

/** Final config for CORS */
const corsConfig: CorsConfig = {
  ORIGIN: process.env.CORS_ORIGIN ?? defaultCorsConfig.DEFAULT_ORIGIN
};

export default corsConfig;