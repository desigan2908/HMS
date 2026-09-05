import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  FaClock,
  FaUserGraduate,
  FaTimes,
} from "react-icons/fa";

import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");

  const [flashMessage, setFlashMessage] = useState("");
  const [showFlash, setShowFlash] = useState(false);

  /* ================= MODAL STATES ================= */

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* ================= STUDENTS ================= */

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Bharath",
      studentId: "HMS2026001",
      department: "Computer Science Engineering",
      room: "A-204",
      status: "Active",
    },
    {
      id: 2,
      name: "Arun",
      studentId: "HMS2026002",
      department: "Information Technology",
      room: "B-102",
      status: "Active",
    },
  ]);

  /* ================= ROOMS ================= */

  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: "A-204",
      block: "Block A",
      type: "4 Sharing",
      capacity: 4,
      occupied: 2,
    },
    {
      id: 2,
      roomNumber: "B-102",
      block: "Block B",
      type: "2 Sharing",
      capacity: 2,
      occupied: 1,
    },
  ]);

  /* ================= COMPLAINTS ================= */

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      student: "Bharath",
      studentId: "HMS2026001",
      message: "Water leakage in bathroom",
      status: "Pending",
    },
    {
      id: 2,
      student: "Arun",
      studentId: "HMS2026002",
      message: "Fan is not working properly",
      status: "In Progress",
    },
  ]);

  /* ================= FEES ================= */

  const [fees, setFees] = useState([
    {
      id: 1,
      student: "Bharath",
      studentId: "HMS2026001",
      totalAmount: 75000,
      paidAmount: 30000,
    },
    {
      id: 2,
      student: "Arun",
      studentId: "HMS2026002",
      totalAmount: 75000,
      paidAmount: 75000,
    },
  ]);

  /* ================= FLASH MESSAGE ================= */

  const showMessage = (message) => {
    setFlashMessage(message);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, 2000);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    showMessage("Admin logged out successfully.");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  /* ================= ROOM EDIT ================= */

  const openRoomEdit = (room) => {
    setSelectedRoom({ ...room });
    setShowRoomModal(true);
  };

  const saveRoom = () => {
    if (!selectedRoom.roomNumber || !selectedRoom.block) {
      alert("Please fill all required fields.");
      return;
    }

    setRooms(
      rooms.map((room) =>
        room.id === selectedRoom.id
          ? selectedRoom
          : room
      )
    );

    setShowRoomModal(false);

    showMessage("Room details updated successfully.");
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));

    showMessage("Room deleted successfully.");
  };

  /* ================= COMPLAINT EDIT ================= */

  const openComplaintEdit = (complaint) => {
    setSelectedComplaint({ ...complaint });
    setShowComplaintModal(true);
  };

  const saveComplaint = () => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === selectedComplaint.id
          ? selectedComplaint
          : complaint
      )
    );

    setShowComplaintModal(false);

    showMessage("Complaint status updated successfully.");
  };

  /* ================= FEE EDIT ================= */

  const openFeeEdit = (fee) => {
    setSelectedFee({ ...fee });
    setShowFeeModal(true);
  };

  const saveFee = () => {
    if (
      selectedFee.paidAmount >
      selectedFee.totalAmount
    ) {
      alert(
        "Paid amount cannot be greater than total amount."
      );
      return;
    }

    setFees(
      fees.map((fee) =>
        fee.id === selectedFee.id
          ? {
              ...selectedFee,
              paidAmount: Number(
                selectedFee.paidAmount
              ),
            }
          : fee
      )
    );

    setShowFeeModal(false);

    showMessage("Fee details updated successfully.");
  };

  /* ================= STUDENT DELETE ================= */

  const deleteStudent = (id) => {
    setStudents(
      students.filter(
        (student) => student.id !== id
      )
    );

    showMessage("Student deleted successfully.");
  };

  /* ================= RENDER CONTENT ================= */

  const renderContent = () => {

    /* ================= DASHBOARD ================= */

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
                <h2>{students.length}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <FaBed />

              <div>
                <p>Total Rooms</p>
                <h2>{rooms.length}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <FaExclamationCircle />

              <div>
                <p>Active Complaints</p>

                <h2>
                  {
                    complaints.filter(
                      (complaint) =>
                        complaint.status !==
                        "Completed"
                    ).length
                  }
                </h2>

              </div>
            </div>

            <div className="admin-stat-card">
              <FaMoneyBillWave />

              <div>
                <p>Fee Records</p>
                <h2>{fees.length}</h2>
              </div>
            </div>

          </div>


          <div className="admin-dashboard-grid">

            <div className="dashboard-card">

              <h2>Recent Complaints</h2>

              {complaints.map((complaint) => (

                <div
                  className="recent-item"
                  key={complaint.id}
                >

                  <div>
                    <strong>
                      {complaint.student}
                    </strong>

                    <p>
                      {complaint.message}
                    </p>
                  </div>

                  <span
                    className={`complaint-status ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </span>

                </div>

              ))}

            </div>


            <div className="dashboard-card">

              <h2>Quick Overview</h2>

              <div className="overview-row">
                <span>Occupied Beds</span>

                <strong>
                  {rooms.reduce(
                    (total, room) =>
                      total +
                      Number(room.occupied),
                    0
                  )}
                </strong>
              </div>

              <div className="overview-row">
                <span>Available Beds</span>

                <strong>
                  {rooms.reduce(
                    (total, room) =>
                      total +
                      (
                        Number(room.capacity) -
                        Number(room.occupied)
                      ),
                    0
                  )}
                </strong>
              </div>

              <div className="overview-row">
                <span>Total Fee Collected</span>

                <strong>
                  ₹
                  {fees.reduce(
                    (total, fee) =>
                      total +
                      Number(fee.paidAmount),
                    0
                  )}
                </strong>
              </div>

            </div>

          </div>

        </div>
      );
    }


    /* ================= ROOMS ================= */

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
              onClick={() =>
                showMessage(
                  "Add Room feature will be added next."
                )
              }
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
                  <th>Block</th>
                  <th>Room Type</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>

                {rooms.map((room) => (

                  <tr key={room.id}>

                    <td>
                      {room.roomNumber}
                    </td>

                    <td>
                      {room.block}
                    </td>

                    <td>
                      {room.type}
                    </td>

                    <td>
                      {room.capacity}
                    </td>

                    <td>
                      {room.occupied}
                    </td>

                    <td>
                      {room.capacity -
                        room.occupied}
                    </td>

                    <td>

                      <button
                        className="action-btn edit"
                        onClick={() =>
                          openRoomEdit(room)
                        }
                      >
                        <FaEdit />
                      </button>


                      <button
                        className="action-btn delete"
                        onClick={() =>
                          deleteRoom(room.id)
                        }
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      );
    }


    /* ================= STUDENTS ================= */

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
              onClick={() =>
                showMessage(
                  "Add Student feature will be added next."
                )
              }
            >
              <FaPlus />
              Add Student
            </button>

          </div>


          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Room Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {students.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.studentId}
                    </td>

                    <td>
                      {student.department}
                    </td>

                    <td>
                      {student.room}
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
                          showMessage(
                            "Student Edit feature will be added next."
                          )
                        }
                      >
                        <FaEdit />
                      </button>


                      <button
                        className="action-btn delete"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      );
    }


    /* ================= COMPLAINTS ================= */

    if (activePage === "complaints") {
      return (
        <div className="admin-content">

          <div className="page-header">

            <h1>
              Complaints Management
            </h1>

            <p>
              Track and update student complaints.
            </p>

          </div>


          <div className="complaints-admin-list">

            {complaints.map((complaint) => (

              <div
                className="admin-complaint-card"
                key={complaint.id}
              >

                <div className="complaint-info">

                  <div className="complaint-avatar">
                    <FaUserGraduate />
                  </div>

                  <div>

                    <h3>
                      {complaint.student}
                    </h3>

                    <span>
                      {complaint.studentId}
                    </span>

                    <p>
                      {complaint.message}
                    </p>

                  </div>

                </div>


                <div className="complaint-actions">

                  <span
                    className={`complaint-status ${complaint.status
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

            ))}

          </div>

        </div>
      );
    }


    /* ================= FEES ================= */

    if (activePage === "fees") {
      return (
        <div className="admin-content">

          <div className="page-header">

            <h1>Fees Details</h1>

            <p>
              Manage student hostel fee payments.
            </p>

          </div>


          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Total Fee</th>
                  <th>Paid Amount</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {fees.map((fee) => {

                  const balance =
                    fee.totalAmount -
                    fee.paidAmount;

                  const isPaid =
                    balance === 0;

                  return (

                    <tr key={fee.id}>

                      <td>
                        {fee.student}
                      </td>

                      <td>
                        {fee.studentId}
                      </td>

                      <td>
                        ₹{fee.totalAmount}
                      </td>

                      <td>
                        ₹{fee.paidAmount}
                      </td>

                      <td>
                        ₹{balance}
                      </td>

                      <td>

                        <span
                          className={
                            isPaid
                              ? "paid-badge"
                              : "not-paid-badge"
                          }
                        >

                          {isPaid
                            ? "Paid"
                            : "Partial / Not Paid"}

                        </span>

                      </td>


                      <td>

                        <button
                          className="action-btn edit"
                          onClick={() =>
                            openFeeEdit(fee)
                          }
                        >
                          <FaEdit />
                        </button>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>


          <div className="fee-info-box">

            <FaCheckCircle />

            Admin can update partial payment amounts.
            Student Dashboard will display Total Fee,
            Paid Amount and Balance Amount.

          </div>

        </div>
      );
    }
  };


  return (
    <div className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}

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


      {/* ================= MAIN ================= */}

      <main className="admin-main-content">

        {renderContent()}

      </main>


      {/* ================= ROOM EDIT MODAL ================= */}

      {showRoomModal && selectedRoom && (

        <div className="modal-overlay">

          <div className="edit-modal">

            <div className="modal-header">

              <h2>Edit Room</h2>

              <button
                onClick={() =>
                  setShowRoomModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>


            <div className="modal-form">

              <label>
                Room Number
              </label>

              <input
                type="text"
                value={
                  selectedRoom.roomNumber
                }
                onChange={(e) =>
                  setSelectedRoom({
                    ...selectedRoom,
                    roomNumber:
                      e.target.value,
                  })
                }
              />


              <label>
                Block
              </label>

              <input
                type="text"
                value={selectedRoom.block}
                onChange={(e) =>
                  setSelectedRoom({
                    ...selectedRoom,
                    block: e.target.value,
                  })
                }
              />


              <label>
                Room Type
              </label>

              <select
                value={selectedRoom.type}
                onChange={(e) =>
                  setSelectedRoom({
                    ...selectedRoom,
                    type: e.target.value,
                  })
                }
              >

                <option>
                  1 Sharing
                </option>

                <option>
                  2 Sharing
                </option>

                <option>
                  3 Sharing
                </option>

                <option>
                  4 Sharing
                </option>

              </select>


              <label>
                Room Capacity
              </label>

              <input
                type="number"
                value={
                  selectedRoom.capacity
                }
                onChange={(e) =>
                  setSelectedRoom({
                    ...selectedRoom,
                    capacity:
                      Number(e.target.value),
                  })
                }
              />


              <label>
                Occupied Beds
              </label>

              <input
                type="number"
                value={
                  selectedRoom.occupied
                }
                onChange={(e) =>
                  setSelectedRoom({
                    ...selectedRoom,
                    occupied:
                      Number(e.target.value),
                  })
                }
              />


              <button
                className="modal-save-btn"
                onClick={saveRoom}
              >
                OK - Save Changes
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================= COMPLAINT EDIT MODAL ================= */}

      {showComplaintModal &&
        selectedComplaint && (

          <div className="modal-overlay">

            <div className="edit-modal">

              <div className="modal-header">

                <h2>
                  Update Complaint
                </h2>

                <button
                  onClick={() =>
                    setShowComplaintModal(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>


              <div className="modal-form">

                <label>
                  Student
                </label>

                <input
                  type="text"
                  value={
                    selectedComplaint.student
                  }
                  disabled
                />


                <label>
                  Complaint
                </label>

                <textarea
                  value={
                    selectedComplaint.message
                  }
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      message:
                        e.target.value,
                    })
                  }
                />


                <label>
                  Complaint Status
                </label>

                <select
                  value={
                    selectedComplaint.status
                  }
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      status:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Completed
                  </option>

                </select>


                <button
                  className="modal-save-btn"
                  onClick={saveComplaint}
                >
                  OK - Update Complaint
                </button>

              </div>

            </div>

          </div>

        )}


      {/* ================= FEE EDIT MODAL ================= */}

      {showFeeModal &&
        selectedFee && (

          <div className="modal-overlay">

            <div className="edit-modal">

              <div className="modal-header">

                <h2>
                  Update Fee Details
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

                <label>
                  Student
                </label>

                <input
                  type="text"
                  value={selectedFee.student}
                  disabled
                />


                <label>
                  Total Fee Amount
                </label>

                <input
                  type="number"
                  value={
                    selectedFee.totalAmount
                  }
                  onChange={(e) =>
                    setSelectedFee({
                      ...selectedFee,
                      totalAmount:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Paid Amount
                </label>

                <input
                  type="number"
                  value={
                    selectedFee.paidAmount
                  }
                  onChange={(e) =>
                    setSelectedFee({
                      ...selectedFee,
                      paidAmount:
                        Number(e.target.value),
                    })
                  }
                />


                <div className="balance-preview">

                  <span>
                    Remaining Balance
                  </span>

                  <strong>
                    ₹
                    {selectedFee.totalAmount -
                      selectedFee.paidAmount}
                  </strong>

                </div>


                <button
                  className="modal-save-btn"
                  onClick={saveFee}
                >
                  OK - Save Fee Details
                </button>

              </div>

            </div>

          </div>

        )}


      {/* ================= FLASH MESSAGE ================= */}

      {showFlash && (

        <div className="admin-flash-overlay">

          <div className="admin-flash-message">

            <FaCheckCircle />

            <h3>
              {flashMessage}
            </h3>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;