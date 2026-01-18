import express from "express";
import {
  createHomework,
  getStudentHomework,
  submitHomework,
  deleteHomework,
  getAllHomeworkAdmin, // ✅ ADD THIS
} from "../controllers/homework.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { uploadPDF } from "../config/multer.js";

const router = express.Router();

/**
 * ============================
 * ADMIN: Create homework
 * ============================
 */
router.post(
  "/",
  protect,
  adminOnly,
  uploadPDF.single("file"),
  createHomework
);

/**
 * ============================
 * ADMIN: Get all homework (ADMIN UI)
 * ============================
 */
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllHomeworkAdmin
);

/**
 * ============================
 * ADMIN: Delete homework (soft delete)
 * ============================
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteHomework
);

/**
 * ============================
 * STUDENT: Get homework
 * ============================
 */
router.get(
  "/student",
  protect,
  getStudentHomework
);

/**
 * ============================
 * STUDENT: Submit homework
 * ============================
 */
router.post(
  "/submit/:homeworkId",
  protect,
  uploadPDF.single("file"),
  submitHomework
);

export default router;