import express from "express";
import {
  getAdminDashboard,
  getStudentDashboard,
} from "../controllers/dashboard.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, getAdminDashboard);
router.get("/student", protect, getStudentDashboard);

export default router;