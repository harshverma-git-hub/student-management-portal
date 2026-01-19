import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";
import path from "path";

const router = express.Router();

router.get("/view", protect, async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: "File URL required" });
    }

    if (!url.includes("res.cloudinary.com")) {
      return res.status(403).json({ message: "Invalid file source" });
    }

    const response = await axios.get(url, {
      responseType: "stream",
    });

    const filename = path.basename(url.split("?")[0]);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename.endsWith(".pdf") ? filename : "file.pdf"}"`
    );

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, max-age=0");

    response.data.pipe(res);
  } catch (error) {
    console.error("PDF stream error:", error.message);
    res.status(500).json({ message: "Failed to stream PDF" });
  }
});

export default router;