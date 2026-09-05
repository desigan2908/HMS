const Room = require("../models/Room");

// ==========================================
// CREATE ROOM - ADMIN
// ==========================================
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      floor,
      capacity,
      totalBeds,
      status,
      description
    } = req.body;

    if (
      !roomNumber ||
      floor === undefined ||
      capacity === undefined ||
      totalBeds === undefined
    ) {
      return res.status(400).json({
        message:
          "Please enter room number, floor, capacity, and total beds"
      });
    }

    if (capacity < 1 || totalBeds < 1) {
      return res.status(400).json({
        message: "Capacity and total beds must be at least 1"
      });
    }

    if (totalBeds > capacity) {
      return res.status(400).json({
        message: "Total beds cannot be greater than capacity"
      });
    }

    if (
      status &&
      !["Available", "Full", "Maintenance"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Available, Full, or Maintenance"
      });
    }

    const existingRoom = await Room.findOne({
      roomNumber: roomNumber.trim()
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists"
      });
    }

    const room = await Room.create({
      roomNumber: roomNumber.trim(),
      floor,
      capacity,
      totalBeds,
      status: status || "Available",
      description: description
        ? description.trim()
        : ""
    });

    res.status(201).json({
      message: "Room created successfully",
      room
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create room",
      error: error.message
    });
  }
};

// ==========================================
// GET ALL ROOMS - ADMIN
// ==========================================
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ floor: 1, roomNumber: 1 });

    res.status(200).json({
      rooms
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message
    });
  }
};

// ==========================================
// GET ROOM BY ID - ADMIN
// ==========================================
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid room ID"
      });
    }

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json({
      room
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch room",
      error: error.message
    });
  }
};

// ==========================================
// UPDATE ROOM - ADMIN
// ==========================================
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid room ID"
      });
    }

    const {
      roomNumber,
      floor,
      capacity,
      totalBeds,
      status,
      description
    } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    // Check duplicate room number
    if (
      roomNumber &&
      roomNumber.trim() !== room.roomNumber
    ) {
      const existingRoom = await Room.findOne({
        roomNumber: roomNumber.trim(),
        _id: { $ne: id }
      });

      if (existingRoom) {
        return res.status(400).json({
          message: "Room number already exists"
        });
      }

      room.roomNumber = roomNumber.trim();
    }

    if (
      status &&
      !["Available", "Full", "Maintenance"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Available, Full, or Maintenance"
      });
    }

    const newCapacity =
      capacity !== undefined
        ? Number(capacity)
        : room.capacity;

    const newTotalBeds =
      totalBeds !== undefined
        ? Number(totalBeds)
        : room.totalBeds;

    if (newCapacity < 1 || newTotalBeds < 1) {
      return res.status(400).json({
        message: "Capacity and total beds must be at least 1"
      });
    }

    if (newTotalBeds > newCapacity) {
      return res.status(400).json({
        message: "Total beds cannot be greater than capacity"
      });
    }

    room.floor =
      floor !== undefined ? floor : room.floor;

    room.capacity = newCapacity;
    room.totalBeds = newTotalBeds;

    if (status) {
      room.status = status;
    }

    if (description !== undefined) {
      room.description = description.trim();
    }

    await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update room",
      error: error.message
    });
  }
};

// ==========================================
// DELETE ROOM - ADMIN
// ==========================================
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid room ID"
      });
    }

    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json({
      message: "Room deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete room",
      error: error.message
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
};