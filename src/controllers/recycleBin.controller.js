import Test from "../models/Test.model.js";
import Homework from "../models/Homework.model.js";
import Announcement from "../models/Announcement.model.js";

/**
 * ============================
 * ADMIN: Get Recycle Bin Items
 * ============================
 */
export const getRecycleBin = async (req, res) => {
  try {
    const tests = await Test.find({ isDeleted: true }).sort({ deletedAt: -1 });
    const homework = await Homework.find({ isDeleted: true }).sort({ deletedAt: -1 });
    const announcements = await Announcement.find({ isDeleted: true }).sort({ deletedAt: -1 });

    res.json({
      tests: tests.map(t => ({
        id: t._id,
        title: t.title,
        deletedAt: t.deletedAt,
      })),
      homework: homework.map(h => ({
        id: h._id,
        title: h.title,
        deletedAt: h.deletedAt,
      })),
      announcements: announcements.map(a => ({
        id: a._id,
        title: a.title,
        deletedAt: a.deletedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch recycle bin",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Restore Item
 * ============================
 */
export const restoreItem = async (req, res) => {
  try {
    const { type, id } = req.body;

    const modelMap = {
      TEST: Test,
      HOMEWORK: Homework,
      ANNOUNCEMENT: Announcement,
    };

    const Model = modelMap[type];
    if (!Model) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const item = await Model.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item restored successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to restore item",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Permanently Delete Item
 * ============================
 */
export const permanentlyDeleteItem = async (req, res) => {
  try {
    const { type, id } = req.body;

    const modelMap = {
      TEST: Test,
      HOMEWORK: Homework,
      ANNOUNCEMENT: Announcement,
    };

    const Model = modelMap[type];
    if (!Model) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item permanently deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to permanently delete item",
      error: err.message,
    });
  }
};
