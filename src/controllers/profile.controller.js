import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";

/**
 * ============================
 * STUDENT: Get Profile
 * ============================
 */
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      isDeleted: false,
    }).populate("user", "userId role");

    if (!student) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      studentId: student.studentId,
      name: student.name,
      batch: student.batch,
      className: student.className,
      school: student.school,
      email: student.email,
      phone: student.phone,
      profilePhoto: student.profilePhoto,
      role: student.user.role,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load profile",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT: Update Password
 * ============================
 */
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update password",
      error: err.message,
    });
  }
};

/**
 * ============================
 * STUDENT: Update Profile Photo
 * ============================
 */
export const updateProfilePhoto = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.profilePhoto = req.file?.path;
    await student.save();

    res.json({
      message: "Profile photo updated",
      profilePhoto: student.profilePhoto,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile photo",
      error: err.message,
    });
  }
};