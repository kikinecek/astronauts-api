import express, { Router } from "express";
import astronauts from "./astronauts";

/**
 * Router that combines all the routers
 */
const router: Router = express.Router();

router.use("/astronauts", astronauts);

export default router;