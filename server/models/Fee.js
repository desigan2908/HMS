const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    dueDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending"
    },

    paymentDate: {
      type: Date,
      default: null
    },

    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Fee", feeSchema);