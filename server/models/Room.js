const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    floor: {
      type: Number,
      required: true,
      min: 0
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    totalBeds: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available"
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

module.exports = mongoose.model("Room", roomSchema);