import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaHome,
  FaBed,
  FaUsers,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaExchangeAlt,
} from "react-icons/fa";

import "../styles/AdminDashboard.css";

// ======================================================
// API
// ======================================================

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach admin JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// EMPTY FORM OBJECTS
// ======================================================

const emptyStudent = {
  username: "",
  password: "",
  name: "",
  rollNo: "",
  bedNumber: "",
  course: "",
  email: "",
  phone: "",
  status: "Active",
};

const emptyRoom = {
  roomNumber: "",
  floor: 0,
  capacity: 1,
  totalBeds: 1,
  status: "Available",
  description: "",
};

const emptyAllocation = {
  studentId: "",
  roomId: "",
  bedNumber: "",
  allocationDate: "",
  remarks: "",
};

const emptyFee = {
  studentId: "",
  amount: "",
  dueDate: "",
  status: "Pending",
  description: "",
};

const emptyComplaint = {
  status: "Pending",
  adminReply: "",
};

// ======================================================
// COMPONENT
// ======================================================

function AdminDashboard() {
  const navigate = useNavigate();

  // ====================================================
  // PAGE
  // ====================================================

  const [activePage, setActivePage] = useState("dashboard");

  // ====================================================
  // DATA
  // ====================================================

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);

  // ====================================================
  // DASHBOARD STATS
  // ====================================================

  const [dashboardStats, setDashboardStats] = useState(null);

  // ====================================================
  // LOADING
  // ====================================================

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ====================================================
  // FLASH
  // ====================================================

  const [flashMessage, setFlashMessage] = useState("");
  const [showFlash, setShowFlash] = useState(false);

  // ====================================================
  // MODALS
  // ====================================================

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // ====================================================
  // SELECTED RECORDS
  // ====================================================

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ====================================================
  // FORM DATA
  // ====================================================

  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [allocationForm, setAllocationForm] =
    useState(emptyAllocation);
  const [feeForm, setFeeForm] = useState(emptyFee);
  const [complaintForm, setComplaintForm] =
    useState(emptyComplaint);

  // ====================================================
  // SEARCH
  // ====================================================

  const [studentSearch, setStudentSearch] = useState("");

  // ====================================================
  // FLASH MESSAGE
  // ====================================================

  const showMessage = (message) => {
    setFlashMessage(message);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, 2500);
  };

  // ====================================================
  // ERROR HANDLER
  // ====================================================

  const handleApiError = (error, fallbackMessage) => {
    console.error(error);

    const message =
      error?.response?.data?.message ||
      fallbackMessage ||
      "Something went wrong.";

    alert(message);
  };

  // ====================================================
  // LOAD ALL DATA
  // ====================================================

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [
        dashboardResponse,
        studentsResponse,
        roomsResponse,
        allocationsResponse,
        complaintsResponse,
        feesResponse,
      ] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/students?limit=1000"),
        api.get("/rooms"),
        api.get("/room-allocations"),
        api.get("/complaints"),
        api.get("/fees"),
      ]);

      setDashboardStats(dashboardResponse.data);

      setStudents(studentsResponse.data.students || []);
      setRooms(roomsResponse.data.rooms || []);
      setAllocations(allocationsResponse.data.allocations || []);
      setComplaints(complaintsResponse.data.complaints || []);
      setFees(feesResponse.data.fees || []);
    } catch (error) {
      console.error("Failed to load admin data:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/", { replace: true });
        return;
      }

      handleApiError(error, "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    loadAllData();
  }, []);

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  // ====================================================
  // STUDENT
  // ====================================================

  const openAddStudent = () => {
    setSelectedStudent(null);
    setStudentForm({ ...emptyStudent });
    setShowStudentModal(true);
  };

  const openEditStudent = (student) => {
    setSelectedStudent(student);

    setStudentForm({
      username: student.username || "",
      password: "",
      name: student.name || "",
      rollNo: student.rollNo || "",
      bedNumber: student.bedNumber || "",
      course: student.course || "",
      email: student.email || "",
      phone: student.phone || "",
      status: student.status || "Active",
    });

    setShowStudentModal(true);
  };

  const saveStudent = async () => {
    try {
      if (
        !studentForm.username ||
        !studentForm.name ||
        !studentForm.rollNo ||
        !studentForm.bedNumber ||
        !studentForm.course ||
        !studentForm.email ||
        !studentForm.phone
      ) {
        alert("Please fill all required student fields.");
        return;
      }

      if (!selectedStudent && !studentForm.password) {
        alert("Password is required when creating a student.");
        return;
      }

      setActionLoading(true);

      if (selectedStudent) {
        const response = await api.put(
          `/students/${selectedStudent._id}`,
          studentForm
        );

        showMessage(
          response.data?.message ||
            "Student updated successfully."
        );
      } else {
        const response = await api.post(
          "/students",
          studentForm
        );

        showMessage(
          response.data?.message ||
            "Student created successfully."
        );
      }

      setShowStudentModal(false);
      setSelectedStudent(null);
      setStudentForm({ ...emptyStudent });

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to save student.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/students/${studentId}`
      );

      showMessage(
        response.data?.message ||
          "Student deleted successfully."
      );

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to delete student.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // ROOM
  // ====================================================

  const openAddRoom = () => {
    setSelectedRoom(null);
    setRoomForm({ ...emptyRoom });
    setShowRoomModal(true);
  };

  const openEditRoom = (room) => {
    setSelectedRoom(room);

    setRoomForm({
      roomNumber: room.roomNumber || "",
      floor: room.floor ?? 0,
      capacity: room.capacity ?? 1,
      totalBeds: room.totalBeds ?? 1,
      status: room.status || "Available",
      description: room.description || "",
    });

    setShowRoomModal(true);
  };

  const saveRoom = async () => {
    try {
      if (
        !roomForm.roomNumber ||
        roomForm.floor === "" ||
        roomForm.capacity === "" ||
        roomForm.totalBeds === ""
      ) {
        alert(
          "Please enter room number, floor, capacity and total beds."
        );
        return;
      }

      if (
        Number(roomForm.totalBeds) >
        Number(roomForm.capacity)
      ) {
        alert(
          "Total beds cannot be greater than room capacity."
        );
        return;
      }

      setActionLoading(true);

      if (selectedRoom) {
        const response = await api.put(
          `/rooms/${selectedRoom._id}`,
          {
            ...roomForm,
            floor: Number(roomForm.floor),
            capacity: Number(roomForm.capacity),
            totalBeds: Number(roomForm.totalBeds),
          }
        );

        showMessage(
          response.data?.message ||
            "Room updated successfully."
        );
      } else {
        const response = await api.post("/rooms", {
          ...roomForm,
          floor: Number(roomForm.floor),
          capacity: Number(roomForm.capacity),
          totalBeds: Number(roomForm.totalBeds),
        });

        showMessage(
          response.data?.message ||
            "Room created successfully."
        );
      }

      setShowRoomModal(false);
      setSelectedRoom(null);
      setRoomForm({ ...emptyRoom });

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to save room.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRoom = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/rooms/${roomId}`
      );

      showMessage(
        response.data?.message ||
          "Room deleted successfully."
      );

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to delete room.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // ROOM ALLOCATION
  // ====================================================

  const openAddAllocation = () => {
    setSelectedAllocation(null);
    setAllocationForm({ ...emptyAllocation });
    setShowAllocationModal(true);
  };

  const saveAllocation = async () => {
    try {
      if (
        !allocationForm.studentId ||
        !allocationForm.roomId ||
        !allocationForm.bedNumber
      ) {
        alert(
          "Please select a student, room and enter bed number."
        );
        return;
      }

      setActionLoading(true);

      const response = await api.post(
        "/room-allocations",
        {
          studentId: allocationForm.studentId,
          roomId: allocationForm.roomId,
          bedNumber: allocationForm.bedNumber,
          allocationDate:
            allocationForm.allocationDate || undefined,
          remarks: allocationForm.remarks,
        }
      );

      showMessage(
        response.data?.message ||
          "Room allocated successfully."
      );

      setShowAllocationModal(false);
      setAllocationForm({ ...emptyAllocation });

      await loadAllData();
    } catch (error) {
      handleApiError(
        error,
        "Failed to allocate room."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const vacateAllocation = async (allocationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to vacate this room allocation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/room-allocations/${allocationId}`
      );

      showMessage(
        response.data?.message ||
          "Room allocation vacated successfully."
      );

      await loadAllData();
    } catch (error) {
      handleApiError(
        error,
        "Failed to vacate room allocation."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // FEES
  // ====================================================

  const openAddFee = () => {
    setSelectedFee(null);
    setFeeForm({ ...emptyFee });
    setShowFeeModal(true);
  };

  const openEditFee = (fee) => {
    setSelectedFee(fee);

    setFeeForm({
      studentId: fee.studentId?._id || "",
      amount: fee.amount ?? "",
      dueDate: fee.dueDate
        ? fee.dueDate.substring(0, 10)
        : "",
      status: fee.status || "Pending",
      description: fee.description || "",
    });

    setShowFeeModal(true);
  };

  const saveFee = async () => {
    try {
      if (
        !feeForm.studentId ||
        feeForm.amount === "" ||
        !feeForm.dueDate
      ) {
        alert(
          "Please select a student, enter amount and due date."
        );
        return;
      }

      if (Number(feeForm.amount) < 0) {
        alert("Fee amount cannot be negative.");
        return;
      }

      setActionLoading(true);

      if (selectedFee) {
        const response = await api.put(
          `/fees/${selectedFee._id}`,
          {
            amount: Number(feeForm.amount),
            dueDate: feeForm.dueDate,
            status: feeForm.status,
            description: feeForm.description,
          }
        );

        showMessage(
          response.data?.message ||
            "Fee updated successfully."
        );
      } else {
        const response = await api.post("/fees", {
          studentId: feeForm.studentId,
          amount: Number(feeForm.amount),
          dueDate: feeForm.dueDate,
          status: feeForm.status,
          description: feeForm.description,
        });

        showMessage(
          response.data?.message ||
            "Fee created successfully."
        );
      }

      setShowFeeModal(false);
      setSelectedFee(null);
      setFeeForm({ ...emptyFee });

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to save fee.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteFee = async (feeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/fees/${feeId}`
      );

      showMessage(
        response.data?.message ||
          "Fee deleted successfully."
      );

      await loadAllData();
    } catch (error) {
      handleApiError(error, "Failed to delete fee.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // COMPLAINT
  // ====================================================

  const openComplaintEdit = (complaint) => {
    setSelectedComplaint(complaint);

    setComplaintForm({
      status: complaint.status || "Pending",
      adminReply: complaint.adminReply || "",
    });

    setShowComplaintModal(true);
  };

  const saveComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      setActionLoading(true);

      const response = await api.put(
        `/complaints/${selectedComplaint._id}`,
        complaintForm
      );

      showMessage(
        response.data?.message ||
          "Complaint updated successfully."
      );

      setShowComplaintModal(false);
      setSelectedComplaint(null);
      setComplaintForm({ ...emptyComplaint });

      await loadAllData();
    } catch (error) {
      handleApiError(
        error,
        "Failed to update complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // FILTER STUDENTS
  // ====================================================

  const filteredStudents = students.filter((student) => {
    const text = studentSearch
      .trim()
      .toLowerCase();

    if (!text) return true;

    return (
      student.name?.toLowerCase().includes(text) ||
      student.username?.toLowerCase().includes(text) ||
      student.rollNo?.toLowerCase().includes(text) ||
      student.email?.toLowerCase().includes(text) ||
      student.course?.toLowerCase().includes(text)
    );
  });

  // ====================================================
  // ROOM OCCUPANCY
  // ====================================================

  const getRoomOccupiedCount = (roomId) => {
    return allocations.filter(
      (allocation) =>
        allocation.roomId?._id === roomId &&
        allocation.status === "Active"
    ).length;
  };

  // ====================================================
  // DASHBOARD CALCULATIONS
  // ====================================================

  const totalStudents =
    dashboardStats?.students?.total ??
    students.length;

  const activeStudents =
    dashboardStats?.students?.active ??
    students.filter(
      (student) => student.status === "Active"
    ).length;

  const totalRooms = rooms.length;

  const occupiedBeds = allocations.filter(
    (allocation) =>
      allocation.status === "Active"
  ).length;

  const availableBeds = Math.max(
    rooms.reduce(
      (total, room) =>
        total + Number(room.totalBeds || 0),
      0
    ) - occupiedBeds,
    0
  );

  const activeComplaints = complaints.filter(
    (complaint) =>
      complaint.status !== "Resolved"
  ).length;

  const pendingFees = fees.filter(
    (fee) => fee.status === "Pending"
  );

  const completedFees = fees.filter(
    (fee) => fee.status === "Completed"
  );

  const pendingAmount = pendingFees.reduce(
    (total, fee) =>
      total + Number(fee.amount || 0),
    0
  );

  const completedAmount = completedFees.reduce(
    (total, fee) =>
      total + Number(fee.amount || 0),
    0
  );

  // ====================================================
  // RENDER CONTENT
  // ====================================================

  const renderContent = () => {
    // ==================================================
    // DASHBOARD
    // ==================================================

    if (activePage === "dashboard") {
      return (
        <div className="admin-content">
          <div className="page-header">
            <h1>Admin Dashboard</h1>

            <p>
              Manage your hostel operations from one place.
            </p>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <FaUsers />

              <div>
                <p>Total Students</p>
                <h2>{totalStudents}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <FaBed />

              <div>
                <p>Total Rooms</p>
                <h2>{totalRooms}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <FaExclamationCircle />

              <div>
                <p>Active Complaints</p>
                <h2>{activeComplaints}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <FaMoneyBillWave />

              <div>
                <p>Pending Fees</p>
                <h2>{pendingFees.length}</h2>
              </div>
            </div>
          </div>

          <div className="admin-dashboard-grid">
            <div className="dashboard-card">
              <h2>Recent Complaints</h2>

              {complaints.length === 0 ? (
                <p>No complaints found.</p>
              ) : (
                complaints.slice(0, 5).map(
                  (complaint) => (
                    <div
                      className="recent-item"
                      key={complaint._id}
                    >
                      <div>
                        <strong>
                          {complaint.studentId?.name ||
                            "Unknown Student"}
                        </strong>

                        <p>
                          {complaint.title}
                        </p>
                      </div>

                      <span
                        className={`complaint-status ${(
                          complaint.status || ""
                        )
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  )
                )
              )}
            </div>

            <div className="dashboard-card">
              <h2>Quick Overview</h2>

              <div className="overview-row">
                <span>Active Students</span>
                <strong>{activeStudents}</strong>
              </div>

              <div className="overview-row">
                <span>Occupied Beds</span>
                <strong>{occupiedBeds}</strong>
              </div>

              <div className="overview-row">
                <span>Available Beds</span>
                <strong>{availableBeds}</strong>
              </div>

              <div className="overview-row">
                <span>Pending Fee Amount</span>
                <strong>
                  ₹{pendingAmount.toLocaleString()}
                </strong>
              </div>

              <div className="overview-row">
                <span>Completed Fee Amount</span>
                <strong>
                  ₹{completedAmount.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==================================================
    // STUDENTS
    // ==================================================

    if (activePage === "students") {
      return (
        <div className="admin-content">
          <div className="page-header page-flex">
            <div>
              <h1>Students Management</h1>

              <p>
                Create, update and manage student records.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={openAddStudent}
            >
              <FaPlus />
              Add Student
            </button>
          </div>

          <div className="table-card">
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) =>
                  setStudentSearch(e.target.value)
                }
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Roll No</th>
                  <th>Course</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(
                    (student) => {
                      const allocation =
                        allocations.find(
                          (item) =>
                            item.studentId?._id ===
                              student._id &&
                            item.status === "Active"
                        );

                      return (
                        <tr key={student._id}>
                          <td>{student.name}</td>

                          <td>
                            {student.username}
                          </td>

                          <td>
                            {student.rollNo}
                          </td>

                          <td>
                            {student.course}
                          </td>

                          <td>
                            {allocation?.roomId
                              ?.roomNumber ||
                              "Not Allocated"}
                          </td>

                          <td>
                            <span className="active-badge">
                              {student.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="action-btn edit"
                              onClick={() =>
                                openEditStudent(
                                  student
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="action-btn delete"
                              onClick={() =>
                                deleteStudent(
                                  student._id
                                )
                              }
                              disabled={actionLoading}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ==================================================
    // ROOMS
    // ==================================================

    if (activePage === "rooms") {
      return (
        <div className="admin-content">
          <div className="page-header page-flex">
            <div>
              <h1>Rooms Management</h1>

              <p>
                Create and manage hostel rooms.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={openAddRoom}
            >
              <FaPlus />
              Add Room
            </button>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Total Beds</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => {
                    const occupied =
                      getRoomOccupiedCount(
                        room._id
                      );

                    const available = Math.max(
                      Number(room.totalBeds) -
                        occupied,
                      0
                    );

                    return (
                      <tr key={room._id}>
                        <td>
                          {room.roomNumber}
                        </td>

                        <td>{room.floor}</td>

                        <td>{room.capacity}</td>

                        <td>{room.totalBeds}</td>

                        <td>{occupied}</td>

                        <td>{available}</td>

                        <td>
                          {room.status}
                        </td>

                        <td>
                          <button
                            className="action-btn edit"
                            onClick={() =>
                              openEditRoom(
                                room
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="action-btn delete"
                            onClick={() =>
                              deleteRoom(
                                room._id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ==================================================
    // ROOM ALLOCATION
    // ==================================================

    if (activePage === "allocation") {
      return (
        <div className="admin-content">
          <div className="page-header page-flex">
            <div>
              <h1>Room Allocation</h1>

              <p>
                Allocate rooms and beds to students.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={openAddAllocation}
            >
              <FaPlus />
              Allocate Room
            </button>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Room</th>
                  <th>Bed</th>
                  <th>Allocation Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {allocations.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No room allocations found.
                    </td>
                  </tr>
                ) : (
                  allocations.map(
                    (allocation) => (
                      <tr
                        key={allocation._id}
                      >
                        <td>
                          {allocation
                            .studentId
                            ?.name ||
                            "Unknown"}
                        </td>

                        <td>
                          {allocation
                            .studentId
                            ?.rollNo ||
                            "-"}
                        </td>

                        <td>
                          {allocation
                            .roomId
                            ?.roomNumber ||
                            "-"}
                        </td>

                        <td>
                          {allocation.bedNumber}
                        </td>

                        <td>
                          {allocation
                            .allocationDate
                            ? new Date(
                                allocation.allocationDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          {allocation.status}
                        </td>

                        <td>
                          {allocation.status ===
                            "Active" && (
                            <button
                              className="action-btn delete"
                              title="Vacate"
                              onClick={() =>
                                vacateAllocation(
                                  allocation._id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              <FaExchangeAlt />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ==================================================
    // COMPLAINTS
    // ==================================================

    if (activePage === "complaints") {
      return (
        <div className="admin-content">
          <div className="page-header">
            <h1>Complaints Management</h1>

            <p>
              Track and update student complaints.
            </p>
          </div>

          <div className="complaints-admin-list">
            {complaints.length === 0 ? (
              <p>No complaints found.</p>
            ) : (
              complaints.map((complaint) => (
                <div
                  className="admin-complaint-card"
                  key={complaint._id}
                >
                  <div className="complaint-info">
                    <div className="complaint-avatar">
                      <FaUsers />
                    </div>

                    <div>
                      <h3>
                        {complaint.studentId
                          ?.name ||
                          "Unknown Student"}
                      </h3>

                      <span>
                        {complaint.studentId
                          ?.rollNo || "-"}
                      </span>

                      <p>
                        <strong>
                          {complaint.title}
                        </strong>
                      </p>

                      <p>
                        {
                          complaint.description
                        }
                      </p>

                      {complaint.adminReply && (
                        <p>
                          <strong>
                            Admin Reply:
                          </strong>{" "}
                          {
                            complaint.adminReply
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="complaint-actions">
                    <span
                      className={`complaint-status ${(
                        complaint.status || ""
                      )
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {complaint.status}
                    </span>

                    <button
                      className="action-btn edit"
                      onClick={() =>
                        openComplaintEdit(
                          complaint
                        )
                      }
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // ==================================================
    // FEES
    // ==================================================

    if (activePage === "fees") {
      return (
        <div className="admin-content">
          <div className="page-header page-flex">
            <div>
              <h1>Fees Management</h1>

              <p>
                Manage student fee records and payment
                status.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={openAddFee}
            >
              <FaPlus />
              Add Fee
            </button>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No fee records found.
                    </td>
                  </tr>
                ) : (
                  fees.map((fee) => (
                    <tr key={fee._id}>
                      <td>
                        {fee.studentId?.name ||
                          "Unknown Student"}
                      </td>

                      <td>
                        {fee.studentId?.rollNo ||
                          "-"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          fee.amount || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {fee.dueDate
                          ? new Date(
                              fee.dueDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={
                            fee.status ===
                            "Completed"
                              ? "paid-badge"
                              : "not-paid-badge"
                          }
                        >
                          {fee.status}
                        </span>
                      </td>

                      <td>
                        {fee.paymentDate
                          ? new Date(
                              fee.paymentDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() =>
                            openEditFee(
                              fee
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() =>
                            deleteFee(
                              fee._id
                            )
                          }
                          disabled={
                            actionLoading
                          }
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div className="admin-dashboard">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>HMS</h2>

          <span>
            Administrator Panel
          </span>
        </div>

        <nav className="admin-sidebar-menu">
          <button
            className={
              activePage === "dashboard"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            <FaHome />
            Dashboard
          </button>

          <button
            className={
              activePage === "rooms"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("rooms")
            }
          >
            <FaBed />
            Rooms
          </button>

          <button
            className={
              activePage === "students"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("students")
            }
          >
            <FaUsers />
            Students
          </button>

          <button
            className={
              activePage === "allocation"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("allocation")
            }
          >
            <FaExchangeAlt />
            Room Allocation
          </button>

          <button
            className={
              activePage === "complaints"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("complaints")
            }
          >
            <FaExclamationCircle />
            Complaints
          </button>

          <button
            className={
              activePage === "fees"
                ? "admin-menu active"
                : "admin-menu"
            }
            onClick={() =>
              setActivePage("fees")
            }
          >
            <FaMoneyBillWave />
            Fees Details
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="admin-main-content">
        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2>Loading dashboard...</h2>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* ==================================================
          STUDENT MODAL
      ================================================== */}

      {showStudentModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>
                {selectedStudent
                  ? "Edit Student"
                  : "Add Student"}
              </h2>

              <button
                onClick={() =>
                  setShowStudentModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-form">
              <label>Username</label>
              <input
                type="text"
                value={studentForm.username}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    username:
                      e.target.value,
                  })
                }
              />

              <label>
                {selectedStudent
                  ? "Password (leave blank to keep current)"
                  : "Password"}
              </label>

              <input
                type="password"
                value={studentForm.password}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    password:
                      e.target.value,
                  })
                }
              />

              <label>Name</label>
              <input
                type="text"
                value={studentForm.name}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    name: e.target.value,
                  })
                }
              />

              <label>Roll Number</label>
              <input
                type="text"
                value={studentForm.rollNo}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    rollNo:
                      e.target.value,
                  })
                }
              />

              <label>Bed Number</label>
              <input
                type="text"
                value={studentForm.bedNumber}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    bedNumber:
                      e.target.value,
                  })
                }
              />

              <label>Course</label>
              <input
                type="text"
                value={studentForm.course}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    course:
                      e.target.value,
                  })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    email:
                      e.target.value,
                  })
                }
              />

              <label>Phone</label>
              <input
                type="text"
                value={studentForm.phone}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    phone:
                      e.target.value,
                  })
                }
              />

              <label>Status</label>

              <select
                value={studentForm.status}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <button
                className="modal-save-btn"
                onClick={saveStudent}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : selectedStudent
                  ? "Update Student"
                  : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          ROOM MODAL
      ================================================== */}

      {showRoomModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>
                {selectedRoom
                  ? "Edit Room"
                  : "Add Room"}
              </h2>

              <button
                onClick={() =>
                  setShowRoomModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-form">
              <label>Room Number</label>

              <input
                type="text"
                value={roomForm.roomNumber}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    roomNumber:
                      e.target.value,
                  })
                }
              />

              <label>Floor</label>

              <input
                type="number"
                min="0"
                value={roomForm.floor}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    floor: Number(
                      e.target.value
                    ),
                  })
                }
              />

              <label>Capacity</label>

              <input
                type="number"
                min="1"
                value={roomForm.capacity}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    capacity: Number(
                      e.target.value
                    ),
                  })
                }
              />

              <label>Total Beds</label>

              <input
                type="number"
                min="1"
                value={roomForm.totalBeds}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    totalBeds: Number(
                      e.target.value
                    ),
                  })
                }
              />

              <label>Status</label>

              <select
                value={roomForm.status}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="Available">
                  Available
                </option>

                <option value="Full">
                  Full
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>
              </select>

              <label>Description</label>

              <textarea
                value={roomForm.description}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    description:
                      e.target.value,
                  })
                }
              />

              <button
                className="modal-save-btn"
                onClick={saveRoom}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : selectedRoom
                  ? "Update Room"
                  : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          ALLOCATION MODAL
      ================================================== */}

      {showAllocationModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Allocate Room</h2>

              <button
                onClick={() =>
                  setShowAllocationModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-form">
              <label>Student</label>

              <select
                value={
                  allocationForm.studentId
                }
                onChange={(e) =>
                  setAllocationForm({
                    ...allocationForm,
                    studentId:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Student
                </option>

                {students
                  .filter(
                    (student) =>
                      student.status ===
                      "Active"
                  )
                  .map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.name} -{" "}
                      {student.rollNo}
                    </option>
                  ))}
              </select>

              <label>Room</label>

              <select
                value={
                  allocationForm.roomId
                }
                onChange={(e) =>
                  setAllocationForm({
                    ...allocationForm,
                    roomId:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Room
                </option>

                {rooms
                  .filter(
                    (room) =>
                      room.status !==
                      "Maintenance" &&
                      getRoomOccupiedCount(
                        room._id
                      ) <
                        Number(
                          room.totalBeds
                        )
                  )
                  .map((room) => (
                    <option
                      key={room._id}
                      value={room._id}
                    >
                      {room.roomNumber} -{" "}
                      {getRoomOccupiedCount(
                        room._id
                      )} /{" "}
                      {room.totalBeds} occupied
                    </option>
                  ))}
              </select>

              <label>Bed Number</label>

              <input
                type="text"
                placeholder="Example: 1"
                value={
                  allocationForm.bedNumber
                }
                onChange={(e) =>
                  setAllocationForm({
                    ...allocationForm,
                    bedNumber:
                      e.target.value,
                  })
                }
              />

              <label>Allocation Date</label>

              <input
                type="date"
                value={
                  allocationForm.allocationDate
                }
                onChange={(e) =>
                  setAllocationForm({
                    ...allocationForm,
                    allocationDate:
                      e.target.value,
                  })
                }
              />

              <label>Remarks</label>

              <textarea
                value={
                  allocationForm.remarks
                }
                onChange={(e) =>
                  setAllocationForm({
                    ...allocationForm,
                    remarks:
                      e.target.value,
                  })
                }
              />

              <button
                className="modal-save-btn"
                onClick={saveAllocation}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Allocating..."
                  : "Allocate Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          FEE MODAL
      ================================================== */}

      {showFeeModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>
                {selectedFee
                  ? "Edit Fee"
                  : "Add Fee"}
              </h2>

              <button
                onClick={() =>
                  setShowFeeModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-form">
              <label>Student</label>

              <select
                value={feeForm.studentId}
                disabled={!!selectedFee}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    studentId:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name} -{" "}
                    {student.rollNo}
                  </option>
                ))}
              </select>

              <label>Amount</label>

              <input
                type="number"
                min="0"
                value={feeForm.amount}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    amount:
                      e.target.value,
                  })
                }
              />

              <label>Due Date</label>

              <input
                type="date"
                value={feeForm.dueDate}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    dueDate:
                      e.target.value,
                  })
                }
              />

              <label>Status</label>

              <select
                value={feeForm.status}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <label>Description</label>

              <textarea
                value={feeForm.description}
                onChange={(e) =>
                  setFeeForm({
                    ...feeForm,
                    description:
                      e.target.value,
                  })
                }
              />

              <button
                className="modal-save-btn"
                onClick={saveFee}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : selectedFee
                  ? "Update Fee"
                  : "Create Fee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          COMPLAINT MODAL
      ================================================== */}

      {showComplaintModal &&
        selectedComplaint && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <div className="modal-header">
                <h2>Update Complaint</h2>

                <button
                  onClick={() =>
                    setShowComplaintModal(
                      false
                    )
                  }
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-form">
                <label>Student</label>

                <input
                  type="text"
                  value={
                    selectedComplaint
                      .studentId?.name ||
                    ""
                  }
                  disabled
                />

                <label>Complaint</label>

                <textarea
                  value={
                    selectedComplaint
                      .description || ""
                  }
                  disabled
                />

                <label>Status</label>

                <select
                  value={
                    complaintForm.status
                  }
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>

                <label>Admin Reply</label>

                <textarea
                  value={
                    complaintForm.adminReply
                  }
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      adminReply:
                        e.target.value,
                    })
                  }
                  placeholder="Enter reply to student..."
                />

                <button
                  className="modal-save-btn"
                  onClick={saveComplaint}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Updating..."
                    : "Update Complaint"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ==================================================
          FLASH MESSAGE
      ================================================== */}

      {showFlash && (
        <div className="admin-flash-overlay">
          <div className="admin-flash-message">
            <FaCheckCircle />

            <h3>{flashMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;