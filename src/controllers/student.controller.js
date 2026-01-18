import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";

/**
 * ============================
 * ADMIN: Create Student
 * ============================
 */
export const createStudent = async (req, res) => {
  try {
    const {
      userId,
      password,
      name,
      batch,
      className,
      timeSlot,
      school,
      phone,
      email,
      address,
    } = req.body;

    // Check existing user
    const exists = await User.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Create auth user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      password: hashedPassword,
      role: "STUDENT",
      isActive: true,
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      studentId: userId,
      name,
      batch,
      className,
      timeSlot,
      school,
      phone,
      email,
      address,
      profilePhoto: req.file?.path,
      status: "active",
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create student",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Get All Students (UI-ready)
 * ============================
 */
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user");

    const uiStudents = students.map((s) => ({
      id: s.studentId,
      name: s.name,
      className: s.className || "",
      batch: s.batch,
      timeSlot: s.timeSlot || "",
      school: s.school || "",
      phone: s.phone || "",
      email: s.email || "",
      address: s.address || "",
      photo: s.profilePhoto || "",
      status: s.user.isActive ? "active" : "inactive",
    }));

    res.json(uiStudents);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Get Single Student Profile
 * ============================
 */
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId }).populate("user");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      id: student.studentId,
      name: student.name,
      className: student.className,
      batch: student.batch,
      timeSlot: student.timeSlot,
      school: student.school,
      phone: student.phone,
      email: student.email,
      address: student.address,
      photo: student.profilePhoto,
      status: student.user.isActive ? "active" : "inactive",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Update Student
 * ============================
 */
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      {
        ...req.body,
        profilePhoto: req.file?.path,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update student",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADMIN: Deactivate Student
 * ============================
 */
export const deactivateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId }).populate("user");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.user.isActive = false;
    await student.user.save();

    res.json({ message: "Student deactivated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to deactivate student",
      error: err.message,
    });
  }
};
/**
 /**
 * ============================
 * ADMIN: Get Students for Dropdown (FIXED)
 * ============================
 */
export const getStudentsForDropdown = async (req, res) => {
  try {
    const students = await Student.find({
      isDeleted: { $ne: true }, // ✅ safer
    }).select("_id studentId name batch");

    res.json(
      students.map((s) => ({
        id: s._id,          // MongoDB _id
        studentId: s.studentId,
        name: s.name,
        batch: s.batch,
      }))
    );
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch students for dropdown",
      error: err.message,
    });
  }
};

/* ================= GET LOGGED-IN STUDENT ================= */
export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      isDeleted: { $ne: true },
    }).populate("user", "email");

    if (!student) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      name: student.name,
      studentId: student.studentId,
      batch: student.batch,
      className: student.className,
      timeSlot: student.timeslot || student.timeSlot,
      school: student.school,
      phone: student.phone,
      email: student.user.email,
      photo: student.photo || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile",
      error: error.message,
    });
  }
};


/* ================= UPDATE STUDENT PROFILE ================= */
/* ================= UPDATE PROFILE ================= */
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);

    if (!student || !user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 🔒 Update password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      await user.save();
    }

    // 🖼️ Update profile photo
    if (req.file) {
      student.photo = `/uploads/${req.file.filename}`;
      await student.save();
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};
