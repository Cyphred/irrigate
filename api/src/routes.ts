import { Router } from "express";
import { logSensorData } from "./controllers/sensorDataController.js";

const router = Router();

router.post("/sensors", logSensorData);

export default router;
