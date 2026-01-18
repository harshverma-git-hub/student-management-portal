import express from "express";
import {
  getStudentProfile,
  updatePassword,
  updateProfilePhoto,
} from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadProfile } from "../config/multer.js";

const router = express.Router();

router.get("/", protect, getStudentProfile);
router.patch("/password", protect, updatePassword);
router.patch(
  "/photo",
  protect,
  uploadProfile.single("photo"),
  updateProfilePhoto
);

export default router;