const express = require("express");

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin creates another user/admin account
router.post(
  "/register",
  adminMiddleware,
  registerUser
);

// Login
router.post("/login", loginUser);

module.exports = router;