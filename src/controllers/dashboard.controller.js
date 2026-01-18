import Student from "../models/Student.model.js";
import Homework from "../models/Homework.model.js";
import Announcement from "../models/Announcement.model.js";

/**
 * ============================
 * COMMON FILTER
 * ============================
 * Treat missing isDeleted as false
 */
const notDeleted = {
  $or: [
    { isDeleted: false },
    { isDeleted: { $exists: false } },
  ],
};

/**
 * ============================
 * ADMIN DASHBOARD ANALYTICS
 * ============================
 */
export const getAdminDashboard = async (req, res) => {
  try {
    /* ================= STUDENTS ================= */
    const totalStudents = await Student.countDocuments(
      notDeleted
    );

    const activeStudents = await Student.countDocuments({
      ...notDeleted,
      status: "active",
    });

    const inactiveStudents =
      totalStudents - activeStudents;

    /* ================= HOMEWORK ================= */
    const totalHomework = await Homework.countDocuments(
      notDeleted
    );

    let submitted = 0;
    let late = 0;
    let pending = 0;

    const homeworkList = await Homework.find(
      notDeleted
    );

    const today = new Date();

    homeworkList.forEach((hw) => {
      // submissions
      hw.submissions.forEach((s) => {
        if (s.status === "SUBMITTED") submitted++;
        if (s.status === "LATE") late++;
      });

      // pending (not yet due)
      if (hw.dueDate && today <= hw.dueDate) {
        pending++;
      }
    });

    /* ================= ANNOUNCEMENTS ================= */
    const totalAnnouncements = await Announcement.countDocuments({
  $or: [
    { isDeleted: false },
    { isDeleted: { $exists: false } },
  ],
  deletedAt: null,
});


    res.json({
      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
      },
      homework: {
        total: totalHomework,
        submitted,
        pending,
        late,
      },
      announcements: totalAnnouncements,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load admin dashboard",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT DASHBOARD ANALYTICS
 * ============================
 */
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      ...notDeleted,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const homeworkList = await Homework.find({
      ...notDeleted,
      $or: [
        { assignedTo: "ALL" },
        { assignedTo: "BATCH", batch: student.batch },
        { assignedTo: "STUDENT", student: student._id },
      ],
    });

    let submitted = 0;
    let late = 0;
    let pending = 0;

    const today = new Date();

    homeworkList.forEach((hw) => {
      const submission = hw.submissions.find(
        (s) =>
          s.student.toString() ===
          student._id.toString()
      );

      if (!submission) {
        if (hw.dueDate && today > hw.dueDate) {
          late++;
        } else {
          pending++;
        }
      } else {
        submitted++;
      }
    });

    const announcements = await Announcement.countDocuments({
  isDeleted: false,
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
});


    res.json({
      homework: {
        total: homeworkList.length,
        submitted,
        pending,
        late,
      },
      announcements,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load student dashboard",
      error: err.message,
    });
  }
};