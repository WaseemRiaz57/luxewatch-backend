import app from "./app";
import connectDB from "./config/database";
import dotenv from "dotenv";

// Environment variables load karein
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Database se connect karein
    await connectDB();
    
    // 2. Server start karein
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      // Humne logic app.ts mein move kar di hai, is liye yahan extra code ki zaroorat nahi
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();