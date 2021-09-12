import Path from "path";
import Dotenv from "dotenv";

/** Load envirnment variables form .env file */
Dotenv.config({
  path: Path.resolve(process.cwd(), ".env")
});
