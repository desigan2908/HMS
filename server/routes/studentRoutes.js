const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/student-dashboard",
  authMiddleware,
  roleMiddleware("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student",
    });
  }
);

module.exports = router;