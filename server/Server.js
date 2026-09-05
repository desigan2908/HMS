const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// ==========================================
// DATABASE
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomAllocationRoutes = require("./routes/roomAllocationRoutes");
const feeRoutes = require("./routes/feeRoutes");

// ==========================================
// API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/rooms", roomRoutes);

app.use(
  "/api/room-allocations",
  roomAllocationRoutes
);

app.use("/api/fees", feeRoutes);

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "Hostel Management Backend is running"
  });
});

// ==========================================
// SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});