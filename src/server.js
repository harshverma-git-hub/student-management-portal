import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

/**
 * ============================
 * START SERVER
 * ============================
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
