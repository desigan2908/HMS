import { useState } from "react";
import {
  ArrowUpRight,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DoorOpen,
  MessageSquareWarning,
  UserRound,
  X,
  Users,
} from "lucide-react";

const notices = [
  {
    title: "Hostel maintenance work",
    description: "Water maintenance will be carried out this Saturday.",
    date: "Today",
  },
  {
    title: "Weekend outing timing",
    description: "Students must return to the hostel before 8:00 PM.",
    date: "Yesterday",
  },
  {
    title: "Mess feedback",
    description: "Submit your monthly feedback before Friday.",
    date: "2 days ago",
  },
];

const complaints = [
  {
    title: "Fan not working",
    room: "Room A-204",
    status: "In Progress",
  },
  {
    title: "Bathroom tap issue",
    room: "Room A-204",
    status: "Resolved",
  },
];

const roomData = {
  roomNumber: "A-204",
  block: "Block A",
  floor: "2nd Floor",
  roomType: "4 Sharing",
  bedNumber: "Bed 2",
  totalBeds: 4,
  occupiedBeds: 3,
  facilities: ["WiFi", "Attached Bathroom", "Air Conditioning", "Study Desk"],
  roommates: [
    {
      id: 1,
      name: "Arun Kumar",
      rollNo: "CSE2026001",
      bedNumber: "Bed 2",
      course: "BE Computer Science",
      email: "arun@example.com",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Rajesh Singh",
      rollNo: "CSE2026002",
      bedNumber: "Bed 1",
      course: "BE Computer Science",
      email: "rajesh@example.com",
      phone: "9876543211",
    },
    {
      id: 3,
      name: "Priya Sharma",
      rollNo: "CSE2026003",
      bedNumber: "Bed 3",
      course: "BE Computer Science",
      email: "priya@example.com",
      phone: "9876543212",
    },
  ],
};

function StudentDashboard() {
  const [showRoomModal, setShowRoomModal] = useState(false);

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="student-heading">
          <div className="heading-content">
            <h1>Student Dashboard</h1>
            <p>Welcome back, Arun. Here's your hostel overview.</p>
          </div>

          <div className="notification-button">
            <Bell size={20} />
            <span></span>
          </div>
        </div>

      <div className="student-stats-grid">
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon blue">
              <BedDouble size={22} />
            </div>
            <span className="status-badge success">Allocated</span>
          </div>
          <h2>A-204</h2>
          <p>Room Number</p>
          <div className="stat-bottom">
            <Building2 size={14} />
            Block A
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon green">
              <CreditCard size={22} />
            </div>
            <span className="status-badge success">Paid</span>
          </div>
          <h2>₹8,500</h2>
          <p>Hostel Fee</p>
          <div className="stat-bottom">
            <CheckCircle2 size={14} />
            Paid for August
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon orange">
              <MessageSquareWarning size={22} />
            </div>
            <span className="status-badge warning">1 Active</span>
          </div>
          <h2>2</h2>
          <p>Total Complaints</p>
          <div className="stat-bottom">
            <CalendarDays size={14} />
            1 complaint in progress
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon purple">
              <CalendarDays size={22} />
            </div>
            <span className="status-badge success">Good</span>
          </div>
          <h2>92%</h2>
          <p>Attendance</p>
          <div className="stat-bottom">
            <CalendarDays size={14} />
            This month
          </div>
        </div>
      </div>

      <div className="student-main-grid">
        <div className="student-card room-card">
          <div className="student-card-header">
            <div>
              <h3>My Room</h3>
              <p>Your current hostel room details</p>
            </div>
            <DoorOpen size={20} />
          </div>

          <div className="room-details">
            <div className="room-number">
              <span>ROOM</span>
              <strong>A-204</strong>
            </div>

            <div className="room-info-grid">
              <div>
                <span>Block</span>
                <strong>Block A</strong>
              </div>
              <div>
                <span>Floor</span>
                <strong>2nd Floor</strong>
              </div>
              <div>
                <span>Room Type</span>
                <strong>4 Sharing</strong>
              </div>
              <div>
                <span>Bed Number</span>
                <strong>Bed 2</strong>
              </div>
            </div>
          </div>

          <button 
            className="outline-button" 
            type="button"
            onClick={() => setShowRoomModal(true)}
          >
            View Room Details
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="student-card profile-card">
          <div className="student-card-header">
            <div>
              <h3>My Profile</h3>
              <p>Your student information</p>
            </div>
            <UserRound size={20} />
          </div>

          <div className="student-profile">
            <div className="profile-avatar">A</div>
            <div>
              <h4>Arun Kumar</h4>
              <p>BE Computer Science</p>
              <span>Roll No: CSE2026001</span>
            </div>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <span>Email Address</span>
              <strong>arun@example.com</strong>
            </div>
            <div className="info-item">
              <span>Phone Number</span>
              <strong>9876543210</strong>
            </div>
          </div>

          <button className="outline-button" type="button">
            View Profile
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      <div className="student-bottom-grid">
        <div className="student-card">
          <div className="student-card-header">
            <div>
              <h3>Latest Notices</h3>
              <p>Important hostel announcements</p>
            </div>
            <Bell size={19} />
          </div>

          <div className="notice-list">
            {notices.map((notice, index) => (
              <div className="notice-item" key={index}>
                <div className="notice-icon">
                  <Bell size={16} />
                </div>
                <div className="notice-content">
                  <div className="notice-title">
                    <h4>{notice.title}</h4>
                    <span>{notice.date}</span>
                  </div>
                  <p>{notice.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="view-all-button" type="button">
            View All Notices
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="student-card">
          <div className="student-card-header">
            <div>
              <h3>My Complaints</h3>
              <p>Track your submitted complaints</p>
            </div>
            <MessageSquareWarning size={19} />
          </div>

          <div className="complaint-list">
            {complaints.map((complaint, index) => (
              <div className="complaint-item" key={index}>
                <div className="complaint-left">
                  <div className="complaint-icon">
                    <MessageSquareWarning size={16} />
                  </div>
                  <div>
                    <h4>{complaint.title}</h4>
                    <p>{complaint.room}</p>
                  </div>
                </div>

                <span
                  className={
                    complaint.status === "Resolved"
                      ? "status-badge success"
                      : "status-badge warning"
                  }
                >
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>

          <button className="primary-small-button" type="button">
            <MessageSquareWarning size={15} />
            Submit Complaint
          </button>
        </div>
      </div>

      <div className="student-card fee-card">
        <div className="fee-left">
          <div className="student-stat-icon green">
            <CreditCard size={22} />
          </div>
          <div>
            <h3>Hostel Fee Payment</h3>
            <p>Your August hostel fee has been paid successfully.</p>
          </div>
        </div>

        <div className="fee-details">
          <div>
            <span>Amount</span>
            <strong>₹8,500</strong>
          </div>
          <div>
            <span>Payment Date</span>
            <strong>15 Aug 2026</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="paid-text">
              <CheckCircle2 size={15} />
              Paid
            </strong>
          </div>
        </div>

        <button className="outline-button" type="button">
          Payment History
          <ArrowUpRight size={15} />
        </button>
      </div>
      </div>

      {/* Room Details Modal */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Room Details & Roommates</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowRoomModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Room Overview */}
              <div className="room-overview-section">
                <h3>Room Information</h3>
                <div className="room-overview-grid">
                  <div className="overview-item">
                    <span>Room Number</span>
                    <strong>{roomData.roomNumber}</strong>
                  </div>
                  <div className="overview-item">
                    <span>Block</span>
                    <strong>{roomData.block}</strong>
                  </div>
                  <div className="overview-item">
                    <span>Floor</span>
                    <strong>{roomData.floor}</strong>
                  </div>
                  <div className="overview-item">
                    <span>Room Type</span>
                    <strong>{roomData.roomType}</strong>
                  </div>
                  <div className="overview-item">
                    <span>Total Beds</span>
                    <strong>{roomData.totalBeds}</strong>
                  </div>
                  <div className="overview-item">
                    <span>Occupied</span>
                    <strong>{roomData.occupiedBeds}/{roomData.totalBeds}</strong>
                  </div>
                </div>
              </div>

              {/* Room Facilities */}
              <div className="room-facilities-section">
                <h3>Room Facilities</h3>
                <div className="facilities-list">
                  {roomData.facilities.map((facility, index) => (
                    <div className="facility-item" key={index}>
                      <span className="facility-dot"></span>
                      {facility}
                    </div>
                  ))}
                </div>
              </div>

              {/* Roommates Section */}
              <div className="roommates-section">
                <h3>
                  <Users size={18} />
                  Roommates ({roomData.roommates.length})
                </h3>
                <div className="roommates-list">
                  {roomData.roommates.map((roommate) => (
                    <div className="roommate-card" key={roommate.id}>
                      <div className="roommate-header">
                        <div className="roommate-avatar">
                          {roommate.name.charAt(0)}
                        </div>
                        <div className="roommate-basic-info">
                          <h4>{roommate.name}</h4>
                          <p>{roommate.course}</p>
                          <span className="roll-no">Roll No: {roommate.rollNo}</span>
                        </div>
                        <div className="bed-info">
                          <span className="bed-label">Bed</span>
                          <strong className="bed-number">{roommate.bedNumber}</strong>
                        </div>
                      </div>
                      <div className="roommate-details">
                        <div className="detail-item">
                          <span>Email</span>
                          <p>{roommate.email}</p>
                        </div>
                        <div className="detail-item">
                          <span>Phone</span>
                          <p>{roommate.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
