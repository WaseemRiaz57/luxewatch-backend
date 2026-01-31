import express from "express"; // 👈 IMPORT ADDED
import path from "path";       // 👈 IMPORT ADDED
import app from "./app";
import connectDB from "./config/database";
import dotenv from "dotenv";

// Environment variables load karein
dotenv.config();

const PORT = process.env.PORT || 5000;

// 👇 YE HAI WO MISSING LINE JO IMAGES DIKHAYEGI 👇
// Ye server ko batata hai ke "uploads" folder ki files public hain
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const startServer = async () => {
  try {
    // 1. Database se connect karein
    await connectDB();
    
    // 2. Server start karein
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📂 Static files served at /uploads`); // Confirmation log
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();