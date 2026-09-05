const Fee = require("../models/Fee");
const Student = require("../models/Student");

// ==========================================
// ADMIN - CREATE FEE
// ==========================================
const createFee = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      dueDate,
      status,
      description
    } = req.body;

    if (
      !studentId ||
      amount === undefined ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "Please provide student ID, amount, and due date"
      });
    }

    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        message: "Fee amount cannot be negative"
      });
    }

    if (
      status &&
      !["Pending", "Completed"].includes(status)
    ) {
      return res.status(400).json({
        message: "Status must be Pending or Completed"
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const fee = await Fee.create({
      studentId,
      amount: Number(amount),
      dueDate,
      status: status || "Pending",
      paymentDate:
        status === "Completed" ? new Date() : null,
      description: description
        ? description.trim()
        : ""
    });

    const populatedFee = await Fee.findById(fee._id)
      .populate(
        "studentId",
        "username name rollNo email"
      );

    res.status(201).json({
      message: "Fee created successfully",
      fee: populatedFee
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create fee",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN - GET ALL FEES
// ==========================================
const getFees = async (req, res) => {
  try {
    const { status, studentId } = req.query;

    const query = {};

    if (status) {
      if (
        !["Pending", "Completed"].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Status must be Pending or Completed"
        });
      }

      query.status = status;
    }

    if (studentId) {
      if (
        !studentId.match(/^[0-9a-fA-F]{24}$/)
      ) {
        return res.status(400).json({
          message: "Invalid student ID"
        });
      }

      query.studentId = studentId;
    }

    const fees = await Fee.find(query)
      .populate(
        "studentId",
        "username name rollNo email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      fees
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch fees",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN - GET FEE BY ID
// ==========================================
const getFeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid fee ID"
      });
    }

    const fee = await Fee.findById(id)
      .populate(
        "studentId",
        "username name rollNo email"
      );

    if (!fee) {
      return res.status(404).json({
        message: "Fee not found"
      });
    }

    res.status(200).json({
      fee
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch fee",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN - UPDATE FEE
// ==========================================
const updateFee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      dueDate,
      status,
      paymentDate,
      description
    } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid fee ID"
      });
    }

    if (
      status &&
      !["Pending", "Completed"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Pending or Completed"
      });
    }

    if (
      amount !== undefined &&
      Number(amount) < 0
    ) {
      return res.status(400).json({
        message: "Fee amount cannot be negative"
      });
    }

    const fee = await Fee.findById(id);

    if (!fee) {
      return res.status(404).json({
        message: "Fee not found"
      });
    }

    if (amount !== undefined) {
      fee.amount = Number(amount);
    }

    if (dueDate !== undefined) {
      fee.dueDate = dueDate;
    }

    if (description !== undefined) {
      fee.description = description.trim();
    }

    if (status) {
      fee.status = status;

      if (status === "Completed") {
        fee.paymentDate =
          paymentDate || new Date();
      }

      if (status === "Pending") {
        fee.paymentDate = null;
      }
    }

    if (
      paymentDate !== undefined &&
      status !== "Pending"
    ) {
      fee.paymentDate = paymentDate;
    }

    await fee.save();

    const updatedFee = await Fee.findById(fee._id)
      .populate(
        "studentId",
        "username name rollNo email"
      );

    res.status(200).json({
      message: "Fee updated successfully",
      fee: updatedFee
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update fee",
      error: error.message
    });
  }
};

// ==========================================
// ADMIN - DELETE FEE
// ==========================================
const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid fee ID"
      });
    }

    const fee = await Fee.findByIdAndDelete(id);

    if (!fee) {
      return res.status(404).json({
        message: "Fee not found"
      });
    }

    res.status(200).json({
      message: "Fee deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete fee",
      error: error.message
    });
  }
};

// ==========================================
// STUDENT - VIEW OWN FEES
// ==========================================
const getMyFees = async (req, res) => {
  try {
    const fees = await Fee.find({
      studentId: req.user.studentId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      fees
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your fees",
      error: error.message
    });
  }
};

module.exports = {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getMyFees
};