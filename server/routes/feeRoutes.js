const express = require("express");

const {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getMyFees
} = require("../controllers/feeController");

const adminMiddleware = require("../middleware/adminMiddleware");
const studentAuthMiddleware = require("../middleware/studentAuthMiddleware");

const router = express.Router();

// ==========================================
// STUDENT
// ==========================================

// Student can ONLY view own fees
router.get(
  "/my",
  studentAuthMiddleware,
  getMyFees
);

// ==========================================
// ADMIN
// ==========================================

// Create fee
router.post(
  "/",
  adminMiddleware,
  createFee
);

// Get all fees
router.get(
  "/",
  adminMiddleware,
  getFees
);

// Get fee by ID
router.get(
  "/:id",
  adminMiddleware,
  getFeeById
);

// Update fee
router.put(
  "/:id",
  adminMiddleware,
  updateFee
);

// Delete fee
router.delete(
  "/:id",
  adminMiddleware,
  deleteFee
);

module.exports = router;