const express = require("express");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent
} = require("../controllers/studentController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ===============================
// STUDENT LOGIN
// ===============================
// Public route
router.post("/login", loginStudent);

// ===============================
// ADMIN STUDENT MANAGEMENT
// ===============================

// Create student
router.post(
  "/",
  adminMiddleware,
  createStudent
);

// Get all students
router.get(
  "/",
  adminMiddleware,
  getStudents
);

// Get student by ID
router.get(
  "/:id",
  adminMiddleware,
  getStudentById
);

// Update student
router.put(
  "/:id",
  adminMiddleware,
  updateStudent
);

// Delete student
router.delete(
  "/:id",
  adminMiddleware,
  deleteStudent
);

module.exports = router;