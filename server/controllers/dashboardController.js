const Student = require("../models/Student");
const Complaint = require("../models/Complaint");

// ==========================================
// ADMIN DASHBOARD
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    // STUDENT COUNTS
    const totalStudents = await Student.countDocuments();

    const activeStudents = await Student.countDocuments({
      status: "Active"
    });

    const inactiveStudents = await Student.countDocuments({
      status: "Inactive"
    });

    // COMPLAINT COUNTS
    const totalComplaints = await Complaint.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({
      status: "Pending"
    });

    const inProgressComplaints = await Complaint.countDocuments({
      status: "In Progress"
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: "Resolved"
    });

    // RECENT COMPLAINTS
    const recentComplaints = await Complaint.find()
      .populate(
        "studentId",
        "username name rollNo bedNumber"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Dashboard data fetched successfully",

      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents
      },

      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints
      },

      recentComplaints
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};