const express = require("express");

const {
  createAllocation,
  getAllocations,
  getAllocationById,
  getStudentAllocation,
  getMyAllocation,
  vacateAllocation
} = require("../controllers/roomAllocationController");

const adminMiddleware = require("../middleware/adminMiddleware");
const studentAuthMiddleware = require("../middleware/studentAuthMiddleware");

const router = express.Router();

// ==========================================
// ROOM ALLOCATION - ADMIN
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

// ==========================================
// ROOM ALLOCATION - STUDENT
// ==========================================

// Get currently logged-in student's allocation
router.get(
  "/my",
  studentAuthMiddleware,
  getMyAllocation
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