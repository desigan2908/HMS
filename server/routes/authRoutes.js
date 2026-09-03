const express = require("express");

 const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Register
router.post("/register", registerUser);
router.post("/login", loginUser);

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working",
  });
});

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});




router.get(
  "/admin-test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/warden-test",
  protect,
  authorizeRoles("warden"),
  (req, res) => {
    res.json({
      message: "Welcome Warden",
    });
  }
);

router.get(
  "/student-test",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student",
    });
  }
);


module.exports = router;