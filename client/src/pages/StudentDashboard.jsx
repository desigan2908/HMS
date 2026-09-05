import { useState } from "react";
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
} from "react-icons/fa";

import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");
  const [complaint, setComplaint] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showFlash, setShowFlash] = useState(false);

  const handleLogout = () => {
    setFlashMessage("You have been logged out successfully.");
    setShowFlash(true);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();

    if (!complaint.trim()) {
      alert("Please enter your complaint.");
      return;
    }

    setFlashMessage("Complaint submitted successfully.");
    setShowFlash(true);

    setComplaint("");

    setTimeout(() => {
      setShowFlash(false);
    }, 2500);
  };


  const renderContent = () => {

    /* ================= DASHBOARD ================= */

    if (activePage === "dashboard") {
      return (
        <div className="dashboard-content">

          <div className="page-title">
            <div>
              <h1>Student Dashboard</h1>
              <p>Welcome back! Here is your current hostel information.</p>
            </div>
          </div>


          <div className="student-info-card">

            <div className="student-profile">

              <FaUserCircle className="profile-icon" />

              <div>
                <h2>Bharath</h2>
                <p>Student ID: HMS2026001</p>
                <p>Computer Science Engineering</p>
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
                <h2>A-204</h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon complaint-icon">
                <FaExclamationCircle />
              </div>

              <div>
                <p>Active Complaints</p>
                <h2>1</h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon payment-icon">
                <FaCreditCard />
              </div>

              <div>
                <p>Fee Status</p>
                <h2>Paid</h2>
              </div>

            </div>

          </div>


          <div className="info-section">

            <h2>Recent Hostel Updates</h2>

            <div className="updates-list">

              <div className="update-item">
                <FaCheckCircle />
                <div>
                  <h4>Room Allocation Confirmed</h4>
                  <p>Your room has been allocated successfully.</p>
                </div>
              </div>


              <div className="update-item">
                <FaCheckCircle />
                <div>
                  <h4>Fee Payment Updated</h4>
                  <p>Your hostel fee payment has been verified.</p>
                </div>
              </div>

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

            <div className="room-header">
              <FaBed />
              <h2>Room A-204</h2>
            </div>


            <div className="details-grid">

              <div className="detail-item">
                <span>Hostel Block</span>
                <strong>Block A</strong>
              </div>


              <div className="detail-item">
                <span>Room Number</span>
                <strong>A-204</strong>
              </div>


              <div className="detail-item">
                <span>Room Type</span>
                <strong>4 Sharing</strong>
              </div>


              <div className="detail-item">
                <span>Bed Number</span>
                <strong>Bed 2</strong>
              </div>


              <div className="detail-item">
                <span>Room Status</span>
                <strong className="status active-status">
                  Active
                </strong>
              </div>

            </div>


            <div className="view-only-message">
              <FaCheckCircle />
              Room details are managed by the hostel administration.
              Students have view-only access.
            </div>

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

                <label>Describe Your Complaint</label>

                <textarea
                  placeholder="Write your complaint here..."
                  value={complaint}
                  onChange={(e) =>
                    setComplaint(e.target.value)
                  }
                ></textarea>


                <button
                  type="submit"
                  className="submit-complaint-btn"
                >

                  <FaPaperPlane />

                  Submit Complaint

                </button>

              </form>

            </div>


            {/* COMPLAINT STATUS */}

            <div className="complaint-status-card">

              <h2>Your Complaints</h2>


              <div className="complaint-item">

                <div className="complaint-top">

                  <h4>Water leakage in bathroom</h4>

                  <span className="status pending">
                    <FaClock />
                    Pending
                  </span>

                </div>

                <p>
                  Complaint submitted on September 3, 2026
                </p>

              </div>


              <div className="complaint-item">

                <div className="complaint-top">

                  <h4>Fan not working properly</h4>

                  <span className="status completed">
                    <FaCheckCircle />
                    Resolved
                  </span>

                </div>

                <p>
                  Complaint resolved successfully.
                </p>

              </div>

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
                <h2>₹75,000</h2>
              </div>

              <div>
                <span>Amount Paid</span>
                <h2>₹75,000</h2>
              </div>

              <div>
                <span>Payment Status</span>

                <strong className="status completed">
                  <FaCheckCircle />
                  Paid
                </strong>
              </div>

            </div>


            <hr />


            <h2>Payment Details</h2>


            <div className="payment-details">

              <div className="payment-row">
                <span>Payment ID</span>
                <strong>PAY2026001</strong>
              </div>

              <div className="payment-row">
                <span>Payment Date</span>
                <strong>August 25, 2026</strong>
              </div>

              <div className="payment-row">
                <span>Payment Method</span>
                <strong>Online Payment</strong>
              </div>

              <div className="payment-row">
                <span>Academic Year</span>
                <strong>2026 - 2027</strong>
              </div>

            </div>


            <div className="view-only-message">
              <FaCheckCircle />
              Payment details are managed by the hostel administration.
              Students have view-only access.
            </div>

          </div>

        </div>
      );
    }
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
            className={
              activePage === "dashboard"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <FaHome />
            Dashboard
          </button>


          <button
            className={
              activePage === "room"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActivePage("room")}
          >
            <FaBed />
            My Room
          </button>


          <button
            className={
              activePage === "complaints"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActivePage("complaints")}
          >
            <FaExclamationCircle />
            Complaints
          </button>


          <button
            className={
              activePage === "fees"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setActivePage("fees")}
          >
            <FaCreditCard />
            Fees & Payments
          </button>


        </nav>


        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        {renderContent()}

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