import { Request, Response, NextFunction } from "express";
import getRedisClient from "../common/getRedisClient.js";
import StateData from "../types/StateData.js";

export const logSensorData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      id,
      distance,
      gateOpen,
      flowRate,
      volume,
    }: {
      id: number;
      distance: number;
      gateOpen: boolean;
      flowRate: number;
      volume: number;
    } = req.body;

    if (
      id === undefined ||
      distance === undefined ||
      gateOpen === undefined ||
      flowRate === undefined ||
      volume === undefined
    )
      return res.status(400).json({ error: "Invalid payload" });

    // Get the state from redis
    const redis = await getRedisClient();
    const stateString = await redis.get(`state:${id}`);

    if (!stateString) {
      const newState: StateData = {
        id,
        distance,
        gateOpen: {
          expected: false,
          current: gateOpen,
        },
        flowRate,
        volume,
        timestamp: new Date().getTime(),
      };

      await redis.set(`state:${id}`, JSON.stringify(newState));

      return res.status(200).json({ message: "New state created" });
    } else {
      const state: StateData = JSON.parse(stateString);
      state.timestamp = new Date().getTime();
      await redis.set(`state:${id}`, JSON.stringify(state));

      if (state.gateOpen.expected === true) {
        return res.status(201).json();
      } else {
        return res.status(200).json();
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getSensorData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { irrigationId } = req.params;

    const redis = await getRedisClient();
    const stateString = await redis.get(`state:${irrigationId}`);

    if (!stateString)
      return res.status(404).json({ error: "Irrigation gate does not exist" });

    const state: StateData = JSON.parse(stateString);

    return res.status(200).json({ ...state });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateOpenState = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { irrigationId } = req.params;
    const { gateOpen }: { gateOpen: boolean } = req.body;

    const redis = await getRedisClient();
    const stateString = await redis.get(`state:${irrigationId}`);

    if (!stateString)
      return res.status(404).json({ error: "Irrigation gate does not exist" });

    const state: StateData = JSON.parse(stateString);
    state.gateOpen.expected = gateOpen;
    redis.set(`state:${irrigationId}`, JSON.stringify(state));

    return res.status(200).json({ ...state });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
