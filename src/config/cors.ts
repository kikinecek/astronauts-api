import { CorsConfig } from "../types/config";

/** Default config for CORS */
const defaultCorsConfig: CorsConfig = {
  ORIGIN: "http://localhost:3000"
}

/** Final config for CORS */
const corsConfig: CorsConfig = {
  ORIGIN: process.env.CORS_ORIGIN ?? defaultCorsConfig.ORIGIN
};

export default corsConfig;