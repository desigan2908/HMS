import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaBed,
  FaExclamationCircle,
  FaCreditCard,
  FaSignOutAlt,
  FaUserCircle,
  FaCheckCircle,
  FaClock,
  FaPaperPlane,
  FaInfoCircle,
} from "react-icons/fa";

import "../styles/StudentDashboard.css";
import { getMyRoomAllocation } from "../api/roomAllocation";
import { createComplaint, getMyComplaints } from "../api/complaint";
import { getMyFees } from "../api/fee";

function StudentDashboard() {
  const navigate = useNavigate();

  // Navigation & UI state
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [showFlash, setShowFlash] = useState(false);

  // Student data states
  const [student, setStudent] = useState(() => {
    try {
      const stored = localStorage.getItem("student");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [roomAllocation, setRoomAllocation] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);

  // New complaint form state
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");

  const showMessage = (msg) => {
    setFlashMessage(msg);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, 2500);
  };

  // Load all student data from backend
  const loadAllStudentData = async (token) => {
    try {
      setLoading(true);

      const [allocationRes, complaintsRes, feesRes] = await Promise.all([
        getMyRoomAllocation(token).catch((err) => {
          console.error("Room allocation fetch error:", err);
          return { allocation: null };
        }),
        getMyComplaints(token).catch((err) => {
          console.error("Complaints fetch error:", err);
          return { complaints: [] };
        }),
        getMyFees(token).catch((err) => {
          console.error("Fees fetch error:", err);
          return { fees: [] };
        }),
      ]);

      setRoomAllocation(allocationRes?.allocation || null);
      setComplaints(complaintsRes?.complaints || []);
      setFees(feesRes?.fees || []);
    } catch (error) {
      console.error("Failed to load student dashboard data:", error);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("student");
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // Check auth & load data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      navigate("/", { replace: true });
      return;
    }

    loadAllStudentData(token);
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("student");

    showMessage("You have been logged out successfully.");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  // Handle Submit Complaint
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!complaintTitle.trim()) {
      alert("Please enter complaint title.");
      return;
    }

    if (!complaintDesc.trim()) {
      alert("Please enter complaint description.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      setActionLoading(true);

      await createComplaint(
        {
          title: complaintTitle.trim(),
          description: complaintDesc.trim(),
        },
        token
      );

      showMessage("Complaint submitted successfully.");
      setComplaintTitle("");
      setComplaintDesc("");

      // Refresh complaints list
      const updated = await getMyComplaints(token);
      setComplaints(updated?.complaints || []);
    } catch (error) {
      console.error("Complaint submission error:", error);
      const msg =
        error?.response?.data?.message || "Failed to submit complaint. Please try again.";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Derived calculations
  const activeComplaintsCount = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const totalFeeAmount = fees.reduce(
    (sum, f) => sum + Number(f.amount || 0),
    0
  );

  const paidFeeAmount = fees
    .filter((f) => f.status === "Completed")
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const pendingFeeAmount = fees
    .filter((f) => f.status === "Pending")
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const overallFeeStatus =
    fees.length === 0
      ? "No Dues"
      : fees.some((f) => f.status === "Pending")
      ? "Pending"
      : "Paid";

  const renderContent = () => {
    /* ================= DASHBOARD ================= */
    if (activePage === "dashboard") {
      return (
        <div className="dashboard-content">
          <div className="page-title">
            <div>
              <h1>Student Dashboard</h1>
              <p>Welcome back, {student?.name || "Student"}! Here is your current hostel information.</p>
            </div>
          </div>

          <div className="student-info-card">
            <div className="student-profile">
              <FaUserCircle className="profile-icon" />

              <div>
                <h2>{student?.name || "Student"}</h2>
                <p>Roll No: {student?.rollNo || "-"}</p>
                <p>{student?.course || "Hostel Resident"}</p>
                {student?.email && <p style={{ fontSize: "12px", opacity: 0.8 }}>Email: {student.email}</p>}
                {student?.phone && <p style={{ fontSize: "12px", opacity: 0.8 }}>Phone: {student.phone}</p>}
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon room-icon">
                <FaBed />
              </div>

              <div>
                <p>Room Number</p>
                <h2>
                  {roomAllocation?.roomId?.roomNumber
                    ? `Room ${roomAllocation.roomId.roomNumber}`
                    : student?.bedNumber
                    ? `Bed ${student.bedNumber}`
                    : "Not Allocated"}
                </h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon complaint-icon">
                <FaExclamationCircle />
              </div>

              <div>
                <p>Active Complaints</p>
                <h2>{activeComplaintsCount}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon payment-icon">
                <FaCreditCard />
              </div>

              <div>
                <p>Fee Status</p>
                <h2>{overallFeeStatus}</h2>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Recent Hostel Updates</h2>

            <div className="updates-list">
              {roomAllocation ? (
                <div className="update-item">
                  <FaCheckCircle />
                  <div>
                    <h4>Room Allocation Active</h4>
                    <p>
                      Allocated Room {roomAllocation.roomId?.roomNumber} (Bed {roomAllocation.bedNumber})
                      {roomAllocation.roomId?.floor !== undefined ? `, Floor ${roomAllocation.roomId.floor}` : ""}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="update-item">
                  <FaInfoCircle style={{ color: "#d97706" }} />
                  <div>
                    <h4>No Room Allocated Yet</h4>
                    <p>Please contact the hostel warden or administrator to get a room allocated.</p>
                  </div>
                </div>
              )}

              {complaints.length > 0 ? (
                <div className="update-item">
                  <FaClock style={{ color: "#3b82f6" }} />
                  <div>
                    <h4>Latest Complaint: {complaints[0].title}</h4>
                    <p>
                      Status: {complaints[0].status}
                      {complaints[0].adminReply ? ` — Admin Reply: "${complaints[0].adminReply}"` : ""}
                    </p>
                  </div>
                </div>
              ) : null}

              {fees.length > 0 ? (
                <div className="update-item">
                  <FaCheckCircle style={{ color: overallFeeStatus === "Paid" ? "#16a34a" : "#d97706" }} />
                  <div>
                    <h4>Fee Status: {overallFeeStatus}</h4>
                    <p>
                      Total: ₹{totalFeeAmount.toLocaleString()} | Paid: ₹{paidFeeAmount.toLocaleString()}
                      {pendingFeeAmount > 0 ? ` | Due: ₹${pendingFeeAmount.toLocaleString()}` : ""}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    /* ================= MY ROOM ================= */
    if (activePage === "room") {
      return (
        <div className="dashboard-content">
          <div className="page-title">
            <h1>My Room</h1>
            <p>View your room allocation details.</p>
          </div>

          <div className="details-card">
            {roomAllocation && roomAllocation.roomId ? (
              <>
                <div className="room-header">
                  <FaBed />
                  <h2>Room {roomAllocation.roomId.roomNumber}</h2>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <span>Floor</span>
                    <strong>Floor {roomAllocation.roomId.floor ?? 0}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Room Number</span>
                    <strong>{roomAllocation.roomId.roomNumber}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Room Capacity</span>
                    <strong>
                      {roomAllocation.roomId.capacity || 1} Sharing (
                      {roomAllocation.roomId.totalBeds || 1} Beds)
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Bed Number</span>
                    <strong>{roomAllocation.bedNumber || "Bed 1"}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Allocation Date</span>
                    <strong>
                      {roomAllocation.allocationDate
                        ? new Date(roomAllocation.allocationDate).toLocaleDateString()
                        : "-"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Status</span>
                    <strong className="status active-status">
                      {roomAllocation.status || "Active"}
                    </strong>
                  </div>
                </div>

                {roomAllocation.remarks && (
                  <div style={{ marginTop: "20px", color: "#667085", fontSize: "14px" }}>
                    <strong>Remarks:</strong> {roomAllocation.remarks}
                  </div>
                )}

                <div className="view-only-message">
                  <FaCheckCircle />
                  Room details are managed by the hostel administration. Students have view-only access.
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <FaBed style={{ fontSize: "50px", color: "#9ca3af", marginBottom: "15px" }} />
                <h3>No Room Allocated Yet</h3>
                <p style={{ color: "#6b7280", marginTop: "10px" }}>
                  You do not have an active room allocation. Please contact the hostel administration to assign your room.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    /* ================= COMPLAINTS ================= */
    if (activePage === "complaints") {
      return (
        <div className="dashboard-content">
          <div className="page-title">
            <h1>Complaints</h1>
            <p>Submit and track your hostel complaints.</p>
          </div>

          <div className="complaint-grid">
            {/* SUBMIT COMPLAINT */}
            <div className="complaint-form-card">
              <h2>Submit New Complaint</h2>

              <form onSubmit={handleComplaintSubmit}>
                <label>Complaint Title / Subject</label>
                <input
                  type="text"
                  placeholder="E.g., Water leakage in bathroom"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  disabled={actionLoading}
                />

                <label>Describe Your Complaint</label>
                <textarea
                  placeholder="Provide details about the issue..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  disabled={actionLoading}
                ></textarea>

                <button
                  type="submit"
                  className="submit-complaint-btn"
                  disabled={actionLoading}
                >
                  <FaPaperPlane />
                  {actionLoading ? "Submitting..." : "Submit Complaint"}
                </button>
              </form>
            </div>

            {/* COMPLAINT STATUS */}
            <div className="complaint-status-card">
              <h2>Your Complaints ({complaints.length})</h2>

              {complaints.length === 0 ? (
                <p style={{ color: "#6b7280", padding: "20px 0" }}>
                  No complaints submitted yet.
                </p>
              ) : (
                complaints.map((c) => {
                  const statusClass = (c.status || "Pending")
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return (
                    <div className="complaint-item" key={c._id}>
                      <div className="complaint-top">
                        <h4>{c.title}</h4>

                        <span className={`status ${statusClass === "resolved" ? "completed" : statusClass}`}>
                          {c.status === "Resolved" ? <FaCheckCircle /> : <FaClock />}
                          {c.status}
                        </span>
                      </div>

                      <p>{c.description}</p>

                      <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                        Submitted on{" "}
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                      </p>

                      {c.adminReply && (
                        <div className="complaint-admin-reply">
                          <strong>Admin Reply:</strong> {c.adminReply}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }

    /* ================= FEES ================= */
    if (activePage === "fees") {
      return (
        <div className="dashboard-content">
          <div className="page-title">
            <h1>Fees & Payments</h1>
            <p>View your hostel payment information.</p>
          </div>

          <div className="fees-card">
            <div className="fee-summary">
              <div>
                <span>Total Hostel Fee</span>
                <h2>₹{totalFeeAmount.toLocaleString()}</h2>
              </div>

              <div>
                <span>Amount Paid</span>
                <h2>₹{paidFeeAmount.toLocaleString()}</h2>
              </div>

              <div>
                <span>Payment Status</span>
                <strong
                  className={`status ${
                    overallFeeStatus === "Paid" ? "completed" : "pending"
                  }`}
                >
                  {overallFeeStatus === "Paid" ? <FaCheckCircle /> : <FaClock />}
                  {overallFeeStatus}
                </strong>
              </div>
            </div>

            <hr />

            <h2>Payment Records</h2>

            <div className="payment-details">
              {fees.length === 0 ? (
                <p style={{ color: "#6b7280", padding: "20px 0" }}>
                  No fee records assigned yet.
                </p>
              ) : (
                fees.map((fee) => (
                  <div className="payment-row" key={fee._id}>
                    <div>
                      <strong>₹{Number(fee.amount || 0).toLocaleString()}</strong>
                      <span style={{ display: "block", fontSize: "12px", color: "#6b7280" }}>
                        {fee.description || "Hostel Fee"}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: "12px" }}>Due: </span>
                      <strong>
                        {fee.dueDate
                          ? new Date(fee.dueDate).toLocaleDateString()
                          : "-"}
                      </strong>
                    </div>

                    <div>
                      <span
                        className={`status ${
                          fee.status === "Completed" ? "completed" : "pending"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </div>

                    {fee.paymentDate && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Paid: {new Date(fee.paymentDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="view-only-message">
              <FaCheckCircle />
              Payment details are managed by the hostel administration. Students have view-only access.
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="student-dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HMS</h2>
          <span>Student Portal</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className={activePage === "dashboard" ? "menu-item active" : "menu-item"}
            onClick={() => setActivePage("dashboard")}
          >
            <FaHome />
            Dashboard
          </button>

          <button
            className={activePage === "room" ? "menu-item active" : "menu-item"}
            onClick={() => setActivePage("room")}
          >
            <FaBed />
            My Room
          </button>

          <button
            className={activePage === "complaints" ? "menu-item active" : "menu-item"}
            onClick={() => setActivePage("complaints")}
          >
            <FaExclamationCircle />
            Complaints {activeComplaintsCount > 0 && `(${activeComplaintsCount})`}
          </button>

          <button
            className={activePage === "fees" ? "menu-item active" : "menu-item"}
            onClick={() => setActivePage("fees")}
          >
            <FaCreditCard />
            Fees & Payments
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            <h3>Loading dashboard data...</h3>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* FLASH MESSAGE */}
      {showFlash && (
        <div className="flash-overlay">
          <div className="flash-message">
            <FaCheckCircle />
            <h3>{flashMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;