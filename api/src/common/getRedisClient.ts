import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

export default async () => {
  const redisClient = createClient({
    // Add this back if the server uses a password
    // password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
  });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
  return redisClient;
};
