import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/luxury-watch-saas",
  skipDb: process.env.SKIP_DB === "true",
};
