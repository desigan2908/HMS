const RoomAllocation = require("../models/RoomAllocation");
const Student = require("../models/Student");
const Room = require("../models/Room");

// ==========================================
// CREATE ROOM ALLOCATION - ADMIN
// ==========================================
const createAllocation = async (req, res) => {
  try {
    const {
      studentId,
      roomId,
      bedNumber,
      allocationDate,
      remarks
    } = req.body;

    if (!studentId || !roomId || !bedNumber) {
      return res.status(400).json({
        message:
          "Please provide student ID, room ID, and bed number"
      });
    }

    // Validate IDs
    if (
      !studentId.match(/^[0-9a-fA-F]{24}$/) ||
      !roomId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.status(400).json({
        message: "Invalid student ID or room ID"
      });
    }

    // Check student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    if (student.status !== "Active") {
      return res.status(400).json({
        message: "Cannot allocate room to an inactive student"
      });
    }

    // Check if student already has active allocation
    const existingStudentAllocation =
      await RoomAllocation.findOne({
        studentId,
        status: "Active"
      });

    if (existingStudentAllocation) {
      return res.status(400).json({
        message:
          "Student already has an active room allocation"
      });
    }

    // Check room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if (room.status === "Maintenance") {
      return res.status(400).json({
        message:
          "Cannot allocate a bed in a room under maintenance"
      });
    }

    // Count currently occupied beds
    const occupiedBeds = await RoomAllocation.countDocuments({
      roomId,
      status: "Active"
    });

    if (occupiedBeds >= room.totalBeds) {
      return res.status(400).json({
        message: "Room is full"
      });
    }

    // Check whether requested bed is already occupied
    const existingBedAllocation =
      await RoomAllocation.findOne({
        roomId,
        bedNumber: bedNumber.trim(),
        status: "Active"
      });

    if (existingBedAllocation) {
      return res.status(400).json({
        message: "This bed is already occupied"
      });
    }

    // Validate bed number
    const bedNumberValue = parseInt(
      bedNumber.replace(/\D/g, ""),
      10
    );

    if (
      !Number.isNaN(bedNumberValue) &&
      bedNumberValue > room.totalBeds
    ) {
      return res.status(400).json({
        message:
          `Bed number cannot be greater than ${room.totalBeds}`
      });
    }

    // Create allocation
    const allocation = await RoomAllocation.create({
      studentId,
      roomId,
      bedNumber: bedNumber.trim(),
      allocationDate:
        allocationDate || new Date(),
      remarks: remarks
        ? remarks.trim()
        : ""
    });

    // Update room status
    const newOccupiedBeds = occupiedBeds + 1;

    if (newOccupiedBeds >= room.totalBeds) {
      room.status = "Full";
      await room.save();
    }

    // Return populated allocation
    const populatedAllocation =
      await RoomAllocation.findById(allocation._id)
        .populate(
          "studentId",
          "username name rollNo email phone"
        )
        .populate(
          "roomId",
          "roomNumber floor capacity totalBeds status"
        );

    res.status(201).json({
      message: "Room allocated successfully",
      allocation: populatedAllocation
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to allocate room",
      error: error.message
    });
  }
};

// ==========================================
// GET ALL ALLOCATIONS - ADMIN
// ==========================================
const getAllocations = async (req, res) => {
  try {
    const allocations = await RoomAllocation.find()
      .populate(
        "studentId",
        "username name rollNo email phone"
      )
      .populate(
        "roomId",
        "roomNumber floor capacity totalBeds status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      allocations
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch room allocations",
      error: error.message
    });
  }
};

// ==========================================
// GET ALLOCATION BY ID - ADMIN
// ==========================================
const getAllocationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid allocation ID"
      });
    }

    const allocation =
      await RoomAllocation.findById(id)
        .populate(
          "studentId",
          "username name rollNo email phone"
        )
        .populate(
          "roomId",
          "roomNumber floor capacity totalBeds status"
        );

    if (!allocation) {
      return res.status(404).json({
        message: "Room allocation not found"
      });
    }

    res.status(200).json({
      allocation
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch room allocation",
      error: error.message
    });
  }
};

// ==========================================
// GET STUDENT ALLOCATION - ADMIN
// ==========================================
const getStudentAllocation = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const allocation =
      await RoomAllocation.findOne({
        studentId,
        status: "Active"
      })
        .populate(
          "studentId",
          "username name rollNo email phone"
        )
        .populate(
          "roomId",
          "roomNumber floor capacity totalBeds status"
        );

    if (!allocation) {
      return res.status(404).json({
        message:
          "No active room allocation found for this student"
      });
    }

    res.status(200).json({
      allocation
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch student allocation",
      error: error.message
    });
  }
};

// ==========================================
// VACATE ROOM - ADMIN
// ==========================================
const vacateAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid allocation ID"
      });
    }

    const allocation =
      await RoomAllocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        message: "Room allocation not found"
      });
    }

    if (allocation.status === "Vacated") {
      return res.status(400).json({
        message: "This allocation is already vacated"
      });
    }

    allocation.status = "Vacated";

    await allocation.save();

    // Update room status back to Available
    const room = await Room.findById(
      allocation.roomId
    );

    if (room && room.status === "Full") {
      room.status = "Available";
      await room.save();
    }

    res.status(200).json({
      message: "Room allocation vacated successfully",
      allocation
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to vacate room allocation",
      error: error.message
    });
  }
};

module.exports = {
  createAllocation,
  getAllocations,
  getAllocationById,
  getStudentAllocation,
  vacateAllocation
};