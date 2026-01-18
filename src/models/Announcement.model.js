import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["ALL", "BATCH", "STUDENT"],
      required: true,
    },

    targetValue: {
      type: String, // batch name OR studentId
    },

    file: {
      type: String, // pdf path
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ======================
       SOFT DELETE FIELDS
       ====================== */
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

export default mongoose.model("Announcement", announcementSchema);