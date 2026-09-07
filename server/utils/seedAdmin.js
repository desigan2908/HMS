const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        name: "Hostel Admin",
        email: "admin@hostel.com",
        phone: "9999999999",
        password: hashedPassword,
        role: "admin",
      });

      console.log("=========================================");
      console.log("Default admin account created:");
      console.log("Email: admin@hostel.com");
      console.log("Password: Admin@123");
      console.log("=========================================");
    }
  } catch (error) {
    console.error("Error checking/seeding default admin:", error.message);
  }
};

module.exports = seedAdmin;

