import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import mongoose from "mongoose";
import app from "./app.js";
import fileRoutes from "./routes/file.routes.js";

const PORT = process.env.PORT || 5000;
app.use("/api/files", fileRoutes);

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
