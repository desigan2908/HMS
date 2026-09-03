const Complaint = require("../models/Complaint");

// ==========================================
// STUDENT RAISE COMPLAINT
// ==========================================
const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Please enter complaint title and description"
      });
    }

    const complaint = await Complaint.create({
      studentId: req.user.studentId,
      title: title.trim(),
      description: description.trim()
    });

    res.status(201).json({
      message: "Complaint raised successfully",
      complaint
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to raise complaint",
      error: error.message
    });
  }
};

// ==========================================
// STUDENT VIEW OWN COMPLAINTS
// ==========================================
const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.user.studentId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      complaints
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your complaints",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN VIEW ALL COMPLAINTS
// ==========================================
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "studentId",
        "username name rollNo bedNumber"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      complaints
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN UPDATE COMPLAINT
// ==========================================
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid complaint ID"
      });
    }

    // Validate status
    const validStatuses = [
      "Pending",
      "In Progress",
      "Resolved"
    ];

    if (
      status &&
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Pending, In Progress, or Resolved"
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // Update status
    if (status) {
      complaint.status = status;
    }

    // Update admin reply
    if (adminReply !== undefined) {
      complaint.adminReply = adminReply.trim();
    }

    await complaint.save();

    // Return populated complaint
    const updatedComplaint = await Complaint.findById(
      complaint._id
    ).populate(
      "studentId",
      "username name rollNo bedNumber"
    );

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update complaint",
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getStudentComplaints,
  getComplaints,
  updateComplaint
};