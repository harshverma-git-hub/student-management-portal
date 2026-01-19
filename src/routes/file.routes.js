import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * PUBLIC ROUTE
 * Auth is already validated when user fetches test/homework list
 */
router.get("/view", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: "File URL missing" });
    }

    const response = await axios.get(url, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);
  } catch (err) {
    console.error("PDF stream error:", err.message);
    res.status(500).json({ message: "Failed to stream PDF" });
  }
});

export default router;