import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/view", protect, async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL required" });
    }

    const response = await axios.get(fileUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load PDF" });
  }
});

export default router;