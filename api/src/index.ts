import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes.js";
import getRedisClient from "./common/getRedisClient.js";

// Loads .env data
dotenv.config();

console.log("Attempting to connect to redis...");
const redis = await getRedisClient();
console.log("Connected to redis");
await redis.quit();

// Create express app
const app = express();

// Enables parsing of incoming data into json
app.use(express.json());

// Logs incoming requests to console
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// IMPORTANT NOTE
// Change the origin to the domain during production
app.use(cors());

// Load in root router
app.use("/", router);

let port = process.env.PORT;
if (!port) port = "8000";

// Start listening for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
