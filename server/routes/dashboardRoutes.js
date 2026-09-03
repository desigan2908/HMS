const express = require("express");

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN DASHBOARD
router.get(
  "/stats",
  adminMiddleware,
  getDashboardStats
);

module.exports = router;