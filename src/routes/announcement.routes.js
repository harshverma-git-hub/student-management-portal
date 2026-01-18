import express from "express";
import {
  createAnnouncement,
  getAllAnnouncementsAdmin,
  getStudentAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { uploadPDF } from "../config/multer.js"; // ✅ CORRECT IMPORT

const router = express.Router();

/**
 * ============================
 * ADMIN: Create announcement
 * ============================
 */
router.post(
  "/",
  protect,
  adminOnly,
  uploadPDF.single("attachment"), // ✅ field name MATCHES frontend
  createAnnouncement
);

/**
 * ============================
 * ADMIN: Get all announcements
 * ============================
 */
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllAnnouncementsAdmin
);

/**
 * ============================
 * STUDENT: Get announcements
 * ============================
 */
router.get(
  "/student",
  protect,
  getStudentAnnouncements
);

/**
 * ============================
 * ADMIN: Delete announcement
 * ============================
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteAnnouncement
);

export default router;