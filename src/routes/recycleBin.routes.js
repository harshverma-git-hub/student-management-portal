import express from "express";
import {
  getRecycleBin,
  restoreItem,
  permanentlyDeleteItem,
} from "../controllers/recycleBin.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ============================
 * ADMIN: Get recycle bin
 * ============================
 */
router.get(
  "/",
  protect,
  adminOnly,
  getRecycleBin
);

/**
 * ============================
 * ADMIN: Restore item
 * ============================
 */
router.patch(
  "/restore",
  protect,
  adminOnly,
  restoreItem
);

/**
 * ============================
 * ADMIN: Permanent delete
 * ============================
 */
router.delete(
  "/permanent",
  protect,
  adminOnly,
  permanentlyDeleteItem
);

export default router;