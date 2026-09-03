const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/admin-dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);