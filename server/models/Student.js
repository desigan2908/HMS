const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    bedNumber: {
      type: String,
      required: true,
      trim: true
    },

    course: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);