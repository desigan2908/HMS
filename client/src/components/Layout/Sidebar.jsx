import {
  Bell,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  Settings,
  Users,
  BedDouble,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Rooms",
      path: "/admin/rooms",
      icon: BedDouble,
    },
    {
      name: "Complaints",
      path: "/admin/complaints",
      icon: MessageSquareWarning,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },
    {
      name: "Notices",
      path: "/admin/notices",
      icon: Bell,
    },
  ];

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Room",
      path: "/student/room",
      icon: BedDouble,
    },
    {
      name: "Complaints",
      path: "/student/complaints",
      icon: MessageSquareWarning,
    },
    {
      name: "Payments",
      path: "/student/payments",
      icon: CreditCard,
    },
    {
      name: "Notices",
      path: "/student/notices",
      icon: Bell,
    },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="sidebar-logo">
          <Building2 size={24} />
        </div>

        <div>
          <h2>HostelHub</h2>
          <span>Management</span>
        </div>

      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">

        {links.map((link) => {

          const Icon = link.icon;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-bottom">

        <NavLink
          to={`/${user?.role}/settings`}
          className="sidebar-link"
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button
          className="sidebar-link logout-button"
          onClick={logout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;