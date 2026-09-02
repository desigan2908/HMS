import { useState } from "react";
import {
  BedDouble,
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  Wifi,
  Wind,
  Lightbulb,
  DoorOpen,
  ArrowLeft,
} from "lucide-react";

const roomData = {
  roomNumber: "A-204",
  block: "Block A",
  floor: "2nd Floor",
  roomType: "4 Sharing",
  totalBeds: 4,
  occupiedBeds: 3,
  availableBeds: 1,
  facilities: [
    { name: "WiFi", icon: Wifi, description: "High-speed internet access" },
    {
      name: "Air Conditioning",
      icon: Wind,
      description: "Central AC system",
    },
    {
      name: "Attached Bathroom",
      icon: DoorOpen,
      description: "Private bathroom",
    },
    { name: "Study Desk", icon: Lightbulb, description: "Individual study area" },
  ],
  roommates: [
    {
      id: 1,
      name: "Arun Kumar",
      rollNo: "CSE2026001",
      bedNumber: "Bed 2",
      course: "BE Computer Science",
      email: "arun@example.com",
      phone: "9876543210",
      status: "Active",
    },
    {
      id: 2,
      name: "Rajesh Singh",
      rollNo: "CSE2026002",
      bedNumber: "Bed 1",
      course: "BE Computer Science",
      email: "rajesh@example.com",
      phone: "9876543211",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Sharma",
      rollNo: "CSE2026003",
      bedNumber: "Bed 3",
      course: "BE Computer Science",
      email: "priya@example.com",
      phone: "9876543212",
      status: "Active",
    },
  ],
};

function MyRoom() {
  const [selectedRoommate, setSelectedRoommate] = useState(null);

  return (
    <div className="my-room-container">
      <div className="my-room-wrapper">
        {/* Header */}
        <div className="my-room-header">
          <div className="header-content">
            <h1>My Room Details</h1>
            <p>Complete information about your hostel room and roommates</p>
          </div>
        </div>

        {/* Room Summary Cards */}
        <div className="room-summary-grid">
          <div className="summary-card">
            <div className="summary-card-icon">
              <BedDouble size={28} />
            </div>
            <div className="summary-card-content">
              <span>Room Number</span>
              <h3>{roomData.roomNumber}</h3>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <Building2 size={28} />
            </div>
            <div className="summary-card-content">
              <span>Location</span>
              <h3>
                {roomData.block}, {roomData.floor}
              </h3>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <Users size={28} />
            </div>
            <div className="summary-card-content">
              <span>Total Students</span>
              <h3>{roomData.occupiedBeds}</h3>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <DoorOpen size={28} />
            </div>
            <div className="summary-card-content">
              <span>Available Beds</span>
              <h3>{roomData.availableBeds}</h3>
            </div>
          </div>
        </div>

        <div className="my-room-content">
          {/* Room Details Section */}
          <div className="room-details-section">
            <div className="section-header">
              <h2>Room Information</h2>
            </div>

            <div className="room-details-grid">
              <div className="detail-card">
                <span className="detail-label">Room Number</span>
                <p className="detail-value">{roomData.roomNumber}</p>
              </div>
              <div className="detail-card">
                <span className="detail-label">Block</span>
                <p className="detail-value">{roomData.block}</p>
              </div>
              <div className="detail-card">
                <span className="detail-label">Floor</span>
                <p className="detail-value">{roomData.floor}</p>
              </div>
              <div className="detail-card">
                <span className="detail-label">Room Type</span>
                <p className="detail-value">{roomData.roomType}</p>
              </div>
              <div className="detail-card">
                <span className="detail-label">Total Beds</span>
                <p className="detail-value">{roomData.totalBeds}</p>
              </div>
              <div className="detail-card">
                <span className="detail-label">Occupied Beds</span>
                <p className="detail-value">
                  {roomData.occupiedBeds}/{roomData.totalBeds}
                </p>
              </div>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="facilities-section">
            <div className="section-header">
              <h2>Room Facilities</h2>
            </div>

            <div className="facilities-grid">
              {roomData.facilities.map((facility, index) => {
                const IconComponent = facility.icon;
                return (
                  <div className="facility-card" key={index}>
                    <div className="facility-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="facility-content">
                      <h4>{facility.name}</h4>
                      <p>{facility.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roommates Section */}
          <div className="roommates-section">
            <div className="section-header">
              <h2>
                <Users size={20} />
                My Roommates ({roomData.roommates.length} Students)
              </h2>
            </div>

            <div className="roommates-grid">
              {roomData.roommates.map((roommate) => (
                <div
                  className="roommate-card-full"
                  key={roommate.id}
                  onClick={() => setSelectedRoommate(roommate)}
                >
                  <div className="roommate-card-header">
                    <div className="roommate-avatar-large">
                      {roommate.name.charAt(0)}
                    </div>
                    <div className="roommate-card-top">
                      <h3>{roommate.name}</h3>
                      <p className="course-info">{roommate.course}</p>
                      <span className="roll-info">
                        <FileText size={13} />
                        Roll No: {roommate.rollNo}
                      </span>
                    </div>
                    <div className="bed-badge">{roommate.bedNumber}</div>
                  </div>

                  <div className="roommate-card-body">
                    <div className="contact-item">
                      <Mail size={16} />
                      <span>{roommate.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={16} />
                      <span>{roommate.phone}</span>
                    </div>
                  </div>

                  <div className="roommate-card-footer">
                    <span className="status-indicator active"></span>
                    <span>{roommate.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roommate Detail Modal */}
      {selectedRoommate && (
        <div
          className="roommate-modal-overlay"
          onClick={() => setSelectedRoommate(null)}
        >
          <div
            className="roommate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedRoommate(null)}
            >
              <ArrowLeft size={24} />
            </button>

            <div className="modal-roommate-header">
              <div className="large-avatar">{selectedRoommate.name.charAt(0)}</div>
              <div className="modal-basic-info">
                <h2>{selectedRoommate.name}</h2>
                <p className="course">{selectedRoommate.course}</p>
                <span className="roll">{selectedRoommate.rollNo}</span>
              </div>
            </div>

            <div className="modal-details">
              <div className="modal-section">
                <h3>Bed Assignment</h3>
                <div className="bed-details">
                  <div className="bed-item">
                    <span>Assigned Bed</span>
                    <strong>{selectedRoommate.bedNumber}</strong>
                  </div>
                  <div className="bed-item">
                    <span>Room</span>
                    <strong>{roomData.roomNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Contact Information</h3>
                <div className="contact-details">
                  <div className="contact-row">
                    <Mail size={18} />
                    <div>
                      <span>Email</span>
                      <p>{selectedRoommate.email}</p>
                    </div>
                  </div>
                  <div className="contact-row">
                    <Phone size={18} />
                    <div>
                      <span>Phone</span>
                      <p>{selectedRoommate.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Status</h3>
                <div className="status-row">
                  <span className="status-indicator active"></span>
                  <span className="status-text">{selectedRoommate.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRoom;
