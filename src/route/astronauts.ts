import express, { Router } from "express";
import AstronautsController from "../controllers/AstronautsController";

/**
 * Router for the astronauts
 */
const router: Router = express.Router()
  .get("/", AstronautsController.getAstronauts)
  .get("/:astronautId(\\d+)", AstronautsController.getAstronautById)
  .put("/:astronautId(\\d+)", AstronautsController.updateAstronaut)
  .delete("/:astronautId(\\d+)", AstronautsController.deleteAstronaut)
  .post("/", AstronautsController.createAstronaut);

export default router;