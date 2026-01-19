import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";
import path from "path";

const router = express.Router();

/**
 * ============================
 * STREAM PDF INLINE (SECURE)
 * ============================
 */
router.get("/view", protect, async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // 🔒 SECURITY: Allow ONLY Cloudinary raw PDFs
    if (!url.includes("res.cloudinary.com")) {
      return res.status(403).json({ message: "Unauthorized file source" });
    }

    const cloudinaryResponse = await axios.get(url, {
      responseType: "stream",
    });

    // 🧠 Extract filename (important for browser preview)
    const filename = path.basename(url.split("?")[0]);

    // ✅ Required headers for INLINE preview
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"`
    );

    // ✅ Forward important headers if present
    if (cloudinaryResponse.headers["content-length"]) {
      res.setHeader(
        "Content-Length",
        cloudinaryResponse.headers["content-length"]
      );
    }

    if (cloudinaryResponse.headers["accept-ranges"]) {
      res.setHeader(
        "Accept-Ranges",
        cloudinaryResponse.headers["accept-ranges"]
      );
    }

    cloudinaryResponse.data.pipe(res);
  } catch (error) {
    console.error("PDF stream error:", error.message);
    res.status(500).json({ message: "Unable to stream PDF" });
  }
});

export default router;