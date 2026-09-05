const express = require("express");

const {
  createAllocation,
  getAllocations,
  getAllocationById,
  getStudentAllocation,
  vacateAllocation
} = require("../controllers/roomAllocationController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// ROOM ALLOCATION - ADMIN ONLY
// ==========================================

// Allocate room/bed to student
router.post(
  "/",
  adminMiddleware,
  createAllocation
);

// Get all allocations
router.get(
  "/",
  adminMiddleware,
  getAllocations
);

// Get allocation for a specific student
router.get(
  "/student/:studentId",
  adminMiddleware,
  getStudentAllocation
);

// Get allocation by allocation ID
router.get(
  "/:id",
  adminMiddleware,
  getAllocationById
);

// Vacate allocation
router.delete(
  "/:id",
  adminMiddleware,
  vacateAllocation
);

module.exports = router;