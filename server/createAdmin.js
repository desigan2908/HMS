const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Admin details
    const name = "Hostel Admin";
    const email = "admin@hostel.com";
    const phone = "9999999999";
    const password = "Admin@123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin"
    });

    console.log("================================");
    console.log("Admin created successfully");
    console.log("================================");
    console.log("Admin ID:", admin._id);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    process.exit(1);
  }
};

createAdmin();