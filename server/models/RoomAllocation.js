const mongoose = require("mongoose");

const roomAllocationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    bedNumber: {
      type: String,
      required: true,
      trim: true
    },

    allocationDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["Active", "Vacated"],
      default: "Active"
    },

    remarks: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "RoomAllocation",
  roomAllocationSchema
);
