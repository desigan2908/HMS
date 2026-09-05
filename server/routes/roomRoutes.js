const express = require("express");

const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// ADMIN ROOM MANAGEMENT
// ==========================================

router.post(
  "/",
  adminMiddleware,
  createRoom
);

router.get(
  "/",
  adminMiddleware,
  getRooms
);

router.get(
  "/:id",
  adminMiddleware,
  getRoomById
);

router.put(
  "/:id",
  adminMiddleware,
  updateRoom
);

router.delete(
  "/:id",
  adminMiddleware,
  deleteRoom
);

module.exports = router;