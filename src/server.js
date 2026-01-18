import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import profileRoutes from "./routes/profile.routes.js";
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));

dotenv.config();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ VERY IMPORTANT
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });