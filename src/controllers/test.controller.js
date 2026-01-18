import Test from "../models/Test.model.js";
import Student from "../models/Student.model.js";

/* ================= ADMIN: Upload Test ================= */
export const uploadTest = async (req, res) => {
  try {
    const {
      title,
      testDate,
      assignedTo,
      batch,
      studentId,
      maxMarks,
      marks,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    if (!maxMarks || Number(maxMarks) <= 0) {
      return res
        .status(400)
        .json({ message: "Valid max marks is required" });
    }

    // If assigning to a specific student, validate student
    let studentObjectId = null;
    if (assignedTo === "STUDENT") {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      studentObjectId = student._id;

      if (marks === undefined || marks === "") {
        return res
          .status(400)
          .json({ message: "Obtained marks is required" });
      }

      if (Number(marks) > Number(maxMarks)) {
        return res.status(400).json({
          message: "Obtained marks cannot exceed max marks",
        });
      }
    }

    const test = await Test.create({
      title,
      testDate,
      pdf: req.file.path,
      assignedTo,
      batch: assignedTo === "BATCH" ? batch : null,
      student: assignedTo === "STUDENT" ? studentObjectId : null,
      maxMarks: Number(maxMarks),
      marks:
        assignedTo === "STUDENT"
          ? Number(marks)
          : null, // IMPORTANT
    });

    res.status(201).json({
      message: "Test uploaded successfully",
      test,
    });
  } catch (err) {
    console.error("UPLOAD TEST ERROR:", err);
    res.status(500).json({
      message: "Failed to upload test",
      error: err.message,
    });
  }
};

/* ================= STUDENT: Get Tests ================= */
export const getStudentTests = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const tests = await Test.find({
      isDeleted: false,
      $or: [
        { assignedTo: "ALL" },
        { assignedTo: "BATCH", batch: student.batch },
        { assignedTo: "STUDENT", student: student._id },
      ],
    }).sort({ createdAt: -1 });

    res.json(
      tests.map((t) => ({
        id: t._id,
        title: t.title,
        date: t.testDate.toISOString().split("T")[0],
        file: t.pdf,
        maxMarks: t.maxMarks,
        marks: t.marks, // null = Not Evaluated
      }))
    );
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tests",
      error: err.message,
    });
  }
};

/* ================= ADMIN: Get All Tests ================= */
export const getAllTestsAdmin = async (req, res) => {
  try {
    const tests = await Test.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.json(
      tests.map((t) => ({
        id: t._id,
        title: t.title,
        date: t.testDate.toISOString().split("T")[0],
        file: t.pdf,
        maxMarks: t.maxMarks,
        assignedTo: t.assignedTo,
        batch: t.batch,
        marks: t.marks,
      }))
    );
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tests",
      error: err.message,
    });
  }
};

/* ================= DELETE TEST ================= */
export const deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.json({ message: "Moved to recycle bin" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete test",
      error: err.message,
    });
  }
};