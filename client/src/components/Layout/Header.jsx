import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user } = useAuth();

  return (
    <header className="header">

      <div className="header-left">

        <button className="mobile-menu">
          <Menu size={22} />
        </button>

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="header-right">

        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">

          <div className="avatar">
            {user?.name?.charAt(0)}
          </div>

          <div className="profile-info">
            <strong>{user?.name}</strong>
            <span>
              {user?.role === "admin"
                ? "Administrator"
                : "Student"}
            </span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;