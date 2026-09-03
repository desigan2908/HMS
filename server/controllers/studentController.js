const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// CREATE STUDENT - ADMIN
// ==========================================
const createStudent = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      rollNo,
      bedNumber,
      course,
      email,
      phone,
      status
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !rollNo ||
      !bedNumber ||
      !course ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        message: "Please enter all required student details"
      });
    }

    if (status && !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Active or Inactive"
      });
    }

    const existingStudent = await Student.findOne({
      $or: [
        { username },
        { rollNo },
        { email }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Username, roll number, or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      username,
      password: hashedPassword,
      name,
      rollNo,
      bedNumber,
      course,
      email,
      phone,
      status: status || "Active"
    });

    res.status(201).json({
      message: "Student created successfully",
      student: {
        id: student._id,
        username: student.username,
        name: student.name,
        rollNo: student.rollNo,
        bedNumber: student.bedNumber,
        course: student.course,
        email: student.email,
        phone: student.phone,
        status: student.status
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create student",
      error: error.message
    });
  }
};

// ==========================================
// GET ALL STUDENTS
// SEARCH + FILTER + PAGINATION
// ==========================================
const getStudents = async (req, res) => {
  try {
    const {
      search = "",
      status,
      page = 1,
      limit = 10
    } = req.query;

    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.max(parseInt(limit) || 10, 1);

    const query = {};

    // SEARCH
    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          username: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          rollNo: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          course: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    // FILTER BY STATUS
    if (status) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          message: "Status must be Active or Inactive"
        });
      }

      query.status = status;
    }

    // TOTAL STUDENTS
    const totalStudents = await Student.countDocuments(query);

    // PAGINATION
    const totalPages = Math.ceil(
      totalStudents / itemsPerPage
    );

    const skip = (currentPage - 1) * itemsPerPage;

    const students = await Student.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json({
      students,
      pagination: {
        currentPage,
        itemsPerPage,
        totalStudents,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message
    });
  }
};

// ==========================================
// GET STUDENT BY ID
// ==========================================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findById(id)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      student
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message
    });
  }
};

// ==========================================
// UPDATE STUDENT - ADMIN
// ==========================================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const {
      username,
      password,
      name,
      rollNo,
      bedNumber,
      course,
      email,
      phone,
      status
    } = req.body;

    if (
      status &&
      !["Active", "Inactive"].includes(status)
    ) {
      return res.status(400).json({
        message: "Status must be Active or Inactive"
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Check duplicate username
    if (username && username !== student.username) {
      const existingUsername = await Student.findOne({
        username,
        _id: { $ne: id }
      });

      if (existingUsername) {
        return res.status(400).json({
          message: "Username already exists"
        });
      }

      student.username = username;
    }

    // Check duplicate roll number
    if (rollNo && rollNo !== student.rollNo) {
      const existingRollNo = await Student.findOne({
        rollNo,
        _id: { $ne: id }
      });

      if (existingRollNo) {
        return res.status(400).json({
          message: "Roll number already exists"
        });
      }

      student.rollNo = rollNo;
    }

    // Check duplicate email
    if (email && email !== student.email) {
      const existingEmail = await Student.findOne({
        email,
        _id: { $ne: id }
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      student.email = email;
    }

    if (name) {
      student.name = name;
    }

    if (bedNumber) {
      student.bedNumber = bedNumber;
    }

    if (course) {
      student.course = course;
    }

    if (phone) {
      student.phone = phone;
    }

    if (status) {
      student.status = status;
    }

    if (password) {
      student.password = await bcrypt.hash(
        password,
        10
      );
    }

    await student.save();

    res.status(200).json({
      message: "Student updated successfully",
      student: {
        id: student._id,
        username: student.username,
        name: student.name,
        rollNo: student.rollNo,
        bedNumber: student.bedNumber,
        course: student.course,
        email: student.email,
        phone: student.phone,
        status: student.status
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update student",
      error: error.message
    });
  }
};

// ==========================================
// DELETE STUDENT - ADMIN
// ==========================================
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete student",
      error: error.message
    });
  }
};

// ==========================================
// STUDENT LOGIN
// ==========================================
const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please enter username and password"
      });
    }

    const student = await Student.findOne({
      username
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    if (student.status !== "Active") {
      return res.status(403).json({
        message: "Student account is inactive"
      });
    }

    const token = jwt.sign(
      {
        studentId: student._id,
        role: "student"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      message: "Student login successful",
      token,
      student: {
        id: student._id,
        username: student.username,
        name: student.name,
        rollNo: student.rollNo,
        bedNumber: student.bedNumber,
        course: student.course,
        email: student.email,
        phone: student.phone,
        status: student.status
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent
};