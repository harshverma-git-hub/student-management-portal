import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Core
    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    // UI-required (optional but supported)
    className: String,
    timeSlot: String,
    school: String,
    phone: String,
    email: String,
    address: String,

    profilePhoto: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    performanceScore: {
      type: Number,
      default: 0,
    },isDeleted: {
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

export default mongoose.model("Student", studentSchema);