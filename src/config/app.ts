import { AppConfig } from "../types/config";

/** Default data for App config in the case envirnment variables are missing */
const defaultAppConfig: AppConfig = {
  PORT: "3001"
};

const appConfig: AppConfig = {
  PORT: process.env.APP_PORT ?? defaultAppConfig.PORT
};

export default appConfig;
