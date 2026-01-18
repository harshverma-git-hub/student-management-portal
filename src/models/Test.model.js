import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    pdf: {
      type: String,
      required: true,
    },

    testDate: {
      type: Date,
      required: true,
    },

    /* ================= ASSIGNMENT LOGIC ================= */
    assignedTo: {
      type: String,
      enum: ["ALL", "BATCH", "STUDENT"],
      default: "ALL",
    },

    batch: {
      type: String,
      default: null,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    /* ================= MARKS ================= */
    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    // ⚠ TEMPORARY: will move to Result collection later
    marks: {
      type: Number,
      default: null,
      min: 0,
    },

    /* ================= SOFT DELETE ================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);