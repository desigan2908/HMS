import {
  ArrowUpRight,
  BedDouble,
  ClipboardList,
  CreditCard,
  DoorOpen,
  IndianRupee,
  MessageSquareWarning,
  MoreHorizontal,
  UserPlus,
  Users,
} from "lucide-react";

const occupancyData = [
  { month: "Jan", occupied: 78 },
  { month: "Feb", occupied: 84 },
  { month: "Mar", occupied: 81 },
  { month: "Apr", occupied: 91 },
  { month: "May", occupied: 88 },
  { month: "Jun", occupied: 95 },
];

const activities = [
  {
    title: "New student registered",
    description: "Arun Kumar was added to Block A",
    time: "10 minutes ago",
  },
  {
    title: "Complaint submitted",
    description: "Room A-204 has a maintenance complaint",
    time: "35 minutes ago",
  },
  {
    title: "Payment received",
    description: "Hostel fee payment received from Rahul",
    time: "1 hour ago",
  },
  {
    title: "Notice published",
    description: "Weekend hostel timing notice published",
    time: "2 hours ago",
  },
];

function StatCard({ title, value, description, icon: Icon, type }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${type}`}>
          <Icon size={22} />
        </div>
        <button className="more-button" type="button">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <h2>{value}</h2>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here's what's happening in your hostel today.</p>
        </div>

        <button className="add-student-button" type="button">
          <UserPlus size={18} />
          Add Student
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students" value="248" description="+12 students this month" icon={Users} type="blue" />
        <StatCard title="Total Rooms" value="120" description="98 rooms currently occupied" icon={BedDouble} type="purple" />
        <StatCard title="Pending Complaints" value="18" description="5 complaints need attention" icon={MessageSquareWarning} type="orange" />
        <StatCard title="Monthly Revenue" value="₹4.8L" description="+8.4% from last month" icon={CreditCard} type="green" />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Room Occupancy</h3>
              <p>Hostel occupancy percentage over the last 6 months</p>
            </div>
            <button className="card-menu" type="button">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="chart-wrapper">
            <div className="simple-chart">
              {occupancyData.map((item) => (
                <div key={item.month} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${item.occupied}%` }}></div>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest hostel activities</p>
            </div>
            <button className="view-all-button" type="button">
              View All
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="activity-list">
            {activities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-icon">
                  {index === 0 && <UserPlus size={16} />}
                  {index === 1 && <MessageSquareWarning size={16} />}
                  {index === 2 && <IndianRupee size={16} />}
                  {index === 3 && <ClipboardList size={16} />}
                </div>

                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card quick-actions-card">
        <div className="card-header">
          <div>
            <h3>Quick Actions</h3>
            <p>Quickly access frequently used features</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          <button className="quick-action" type="button">
            <div className="quick-icon blue">
              <UserPlus size={21} />
            </div>
            <div>
              <strong>Add Student</strong>
              <span>Register new student</span>
            </div>
          </button>

          <button className="quick-action" type="button">
            <div className="quick-icon purple">
              <DoorOpen size={21} />
            </div>
            <div>
              <strong>Manage Rooms</strong>
              <span>View room availability</span>
            </div>
          </button>

          <button className="quick-action" type="button">
            <div className="quick-icon orange">
              <ClipboardList size={21} />
            </div>
            <div>
              <strong>View Complaints</strong>
              <span>Manage pending complaints</span>
            </div>
          </button>

          <button className="quick-action" type="button">
            <div className="quick-icon green">
              <CreditCard size={21} />
            </div>
            <div>
              <strong>Payments</strong>
              <span>Check fee payments</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
  