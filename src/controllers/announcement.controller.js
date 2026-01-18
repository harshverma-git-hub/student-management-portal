import Announcement from "../models/Announcement.model.js";
import Student from "../models/Student.model.js";

/**
 * ============================
 * ADMIN: Create Announcement
 * ============================
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetType, targetValue } = req.body;

    let finalTargetValue = null;

    if (targetType === "STUDENT") {
      // Expecting STUDENT _id (ObjectId)
      const student = await Student.findById(targetValue);
      if (!student) {
        return res.status(400).json({
          message: "Invalid student selected",
        });
      }
      finalTargetValue = student._id;
    }

    if (targetType === "BATCH") {
      finalTargetValue = targetValue;
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetType,
      targetValue: finalTargetValue,
      file: req.file?.path || null,
      createdBy: req.user.id,
      isDeleted: false,
      deletedAt: null,
    });

    res.status(201).json({
      message: "Announcement published",
      announcement,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create announcement",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Soft delete announcement
 * ============================
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.isDeleted = true;
    announcement.deletedAt = new Date();

    await announcement.save();

    res.json({ message: "Announcement moved to recycle bin" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete announcement",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Get All Announcements
 * ============================
 */
export const getAllAnnouncementsAdmin = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    const uiData = announcements.map((a) => {
      let targetLabel = "All Students";

      if (a.targetType === "BATCH") {
        targetLabel = `Batch: ${a.targetValue}`;
      }

      if (a.targetType === "STUDENT") {
        targetLabel = `Student (ID linked)`;
      }

      return {
        id: a._id,
        title: a.title,
        message: a.message,
        targetType: a.targetType,
        targetValue: a.targetValue,
        targetLabel,
        assignmentType: a.targetType,
        date: a.createdAt.toISOString().split("T")[0],
        file: a.file,
        hasAttachment: !!a.file,
      };
    });

    res.json(uiData);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch announcements",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT: Get Announcements
 * ============================
 */
export const getStudentAnnouncements = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const announcements = await Announcement.find({
      $and: [
        {
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
          ],
        },
        {
          $or: [
            { targetType: "ALL" },
            {
              targetType: "BATCH",
              targetValue: student.batch,
            },
            {
              targetType: "STUDENT",
              targetValue: student.studentId,
            },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch announcements",
      error: err.message,
    });
  }
};
