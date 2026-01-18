import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    file: String,

    assignedTo: {
      type: String, // ALL | BATCH | STUDENT
      enum: ["ALL", "BATCH", "STUDENT"],
      required: true,
    },

    batch: String,

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    dueDate: Date,

    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        file: String,
        submittedAt: Date,
        status: {
          type: String,
          enum: ["SUBMITTED", "LATE"],
        },
      },
    ],

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

export default mongoose.model("Homework", homeworkSchema);