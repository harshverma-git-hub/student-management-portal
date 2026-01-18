import Homework from "../models/Homework.model.js";
import Student from "../models/Student.model.js";

/**
 * ============================
 * ADMIN: Create Homework
 * ============================
 */
export const createHomework = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      batch,
      studentId,
      dueDate,
    } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({
        message: "Title, assignment type and due date are required",
      });
    }

    let studentObjectId = null;

    if (assignedTo === "STUDENT") {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      studentObjectId = student._id;
    }

    const homework = await Homework.create({
      title,
      description,
      file: req.file?.path || null,
      assignedTo,
      batch: assignedTo === "BATCH" ? batch : null,
      student: assignedTo === "STUDENT" ? studentObjectId : null,
      dueDate,
    });

    res.status(201).json({
      message: "Homework created successfully",
      homework,
    });
  } catch (err) {
    console.error("CREATE HOMEWORK ERROR:", err);
    res.status(500).json({
      message: "Failed to create homework",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Get All Homework (UI-Optimized)
 * ============================
 */
export const getAllHomeworkAdmin = async (req, res) => {
  try {
    const homeworkList = await Homework.find({
      isDeleted: false,
    })
      .populate("student", "studentId name")
      .sort({ createdAt: -1 });

    const uiData = homeworkList.map((h) => {
      let targetLabel = "All Students";

      if (h.assignedTo === "BATCH") {
        targetLabel = `Batch: ${h.batch}`;
      }

      if (h.assignedTo === "STUDENT") {
        targetLabel = h.student
          ? `Student: ${h.student.name} (${h.student.studentId})`
          : "Student";
      }

      return {
        id: h._id,
        title: h.title,
        description: h.description,
        dueDate: h.dueDate
          ? h.dueDate.toISOString().split("T")[0]
          : null,
        assignmentType: h.assignedTo,
        targetLabel,
        file: h.file,
        hasAttachment: !!h.file,
        submissionCount: h.submissions.length,
        createdAt: h.createdAt.toISOString().split("T")[0],
      };
    });

    res.json(uiData);
  } catch (err) {
    console.error("FETCH HOMEWORK ADMIN ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch homework",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT: Get Homework
 * ============================
 */
export const getStudentHomework = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const homework = await Homework.find({
      isDeleted: false,
      $or: [
        { assignedTo: "ALL" },
        { assignedTo: "BATCH", batch: student.batch },
        { assignedTo: "STUDENT", student: student._id },
      ],
    }).sort({ dueDate: 1 });

    res.json(
      homework.map((h) => ({
        id: h._id,
        title: h.title,
        description: h.description,
        dueDate: h.dueDate
          ? h.dueDate.toISOString().split("T")[0]
          : null,
        file: h.file,
        assignedTo: h.assignedTo,
        submitted: h.submissions.some(
          (s) => s.student.toString() === student._id.toString()
        ),
      }))
    );
  } catch (err) {
    console.error("FETCH STUDENT HOMEWORK ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch homework",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT: Submit Homework
 * ============================
 */
export const submitHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework || homework.isDeleted) {
      return res.status(404).json({ message: "Homework not found" });
    }

    const alreadySubmitted = homework.submissions.some(
      (s) => s.student.toString() === student._id.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "Homework already submitted",
      });
    }

    const isLate =
      homework.dueDate && new Date() > new Date(homework.dueDate);

    homework.submissions.push({
      student: student._id,
      file: req.file?.path || null,
      submittedAt: new Date(),
      status: isLate ? "LATE" : "SUBMITTED",
    });

    await homework.save();

    res.json({
      message: "Homework submitted successfully",
    });
  } catch (err) {
    console.error("SUBMIT HOMEWORK ERROR:", err);
    res.status(500).json({
      message: "Failed to submit homework",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Delete Homework (Soft Delete)
 * ============================
 */
export const deleteHomework = async (req, res) => {
  try {
    await Homework.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.json({
      message: "Homework moved to recycle bin",
    });
  } catch (err) {
    console.error("DELETE HOMEWORK ERROR:", err);
    res.status(500).json({
      message: "Failed to delete homework",
      error: err.message,
    });
  }
};