import express from "express";
import {
  uploadTest,
  getStudentTests,
  getAllTestsAdmin,
  deleteTest,
} from "../controllers/test.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { uploadPDF } from "../config/multer.js";

const router = express.Router();

/* ================= ADMIN ================= */

// Upload test paper
router.post(
  "/",
  protect,
  adminOnly,
  uploadPDF.single("pdf"), // ✅ MUST be "pdf"
  uploadTest
);

// Get all tests (admin panel)
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllTestsAdmin
);

// Soft delete (recycle bin)
router.patch(
  "/delete/:id",
  protect,
  adminOnly,
  deleteTest
);

/* ================= STUDENT ================= */

// Get assigned tests
router.get(
  "/student",
  protect,
  getStudentTests
);

export default router;