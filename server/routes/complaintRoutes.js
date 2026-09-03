const express = require("express");

const {
  createComplaint,
  getStudentComplaints,
  getComplaints,
  updateComplaint
} = require("../controllers/complaintController");

const studentAuthMiddleware = require("../middleware/studentAuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// STUDENT
// Raise complaint
router.post(
  "/",
  studentAuthMiddleware,
  createComplaint
);

// Student views only their own complaints
router.get(
  "/my",
  studentAuthMiddleware,
  getStudentComplaints
);

// ADMIN
// View all complaints
router.get(
  "/",
  adminMiddleware,
  getComplaints
);

// Update complaint status/reply
router.put(
  "/:id",
  adminMiddleware,
  updateComplaint
);

module.exports = router;