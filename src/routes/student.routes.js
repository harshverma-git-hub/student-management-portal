import express from "express";
import {
  createStudent,
  getStudents,
  deactivateStudent,
  getStudentsForDropdown,
  updateStudentProfile,
  getMyProfile,
} from "../controllers/student.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { uploadProfile } from "../config/multer.js";

const router = express.Router();

/* ================= ADMIN ================= */

router.post(
  "/",
  protect,
  adminOnly,
  uploadProfile.single("profilePhoto"),
  createStudent
);

router.get("/", protect, adminOnly, getStudents);

router.get("/dropdown", protect, adminOnly, getStudentsForDropdown);

router.patch(
  "/deactivate/:studentId",
  protect,
  adminOnly,
  deactivateStudent
);

/* ================= STUDENT ================= */

/** ✅ GET own profile */
router.get("/profile", protect, getMyProfile);

/** ✅ UPDATE password / photo only */
router.patch(
  "/profile",
  protect,
  uploadProfile.single("photo"),
  updateStudentProfile
);

export default router;