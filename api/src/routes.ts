import { Router } from "express";
import {
  getSensorData,
  logSensorData,
  updateOpenState,
} from "./controllers/sensorDataController.js";

const router = Router();

router.post("/sensors", logSensorData);
router.get("/sensors/:irrigationId", getSensorData);
router.patch("/sensors/:irrigationId", updateOpenState);

export default router;
