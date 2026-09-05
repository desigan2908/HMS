import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      if (role === "student") {
        if (!studentId || !password) {
          alert("Please enter Student ID and Password");
          setLoading(false);
          return;
        }

        navigate("/student-dashboard");
      } else {
        if (!adminId || !password) {
          alert("Please enter Admin ID and Password");
          setLoading(false);
          return;
        }

        navigate("/admin-dashboard");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-banner">

        <div className="overlay"></div>

        <div className="banner-content">

          {/* Removed H Icon and HostelHub Logo */}

          <div className="welcome-section">
            <h1>
              Smart Hostel
              <br />
              Management System
            </h1>

            <p>
              A centralized platform for students and administrators
              to manage hostel activities efficiently.
            </p>
          </div>

          <div className="features">

            <div className="feature-item">
              <span>✓</span>
              Secure Authentication
            </div>

            <div className="feature-item">
              <span>✓</span>
              Student Management
            </div>

            <div className="feature-item">
              <span>✓</span>
              Admin Control Panel
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE LOGIN */}
      <div className="login-container">

        <div className="login-box">

          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please login to access your account</p>
          </div>


          {/* ROLE SELECTOR */}

          <div className="role-selector">

            <button
              type="button"
              className={`role-btn ${
                role === "student" ? "active" : ""
              }`}
              onClick={() => setRole("student")}
            >
              <FaUserGraduate />

              <div>
                <strong>Student</strong>
                <small>Student Login</small>
              </div>
            </button>


            <button
              type="button"
              className={`role-btn ${
                role === "admin" ? "active" : ""
              }`}
              onClick={() => setRole("admin")}
            >
              <FaUserShield />

              <div>
                <strong>Admin</strong>
                <small>Administrator Login</small>
              </div>
            </button>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

            {/* STUDENT LOGIN */}

            {role === "student" ? (

              <div className="input-group">

                <label>Student ID</label>

                <div className="input-wrapper">

                  <FaUserGraduate className="input-icon" />

                  <input
                    type="text"
                    placeholder="Enter your Student ID"
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(e.target.value)
                    }
                  />

                </div>

              </div>

            ) : (

              /* ADMIN LOGIN */

              <div className="input-group">

                <label>Admin ID</label>

                <div className="input-wrapper">

                  <FaUserShield className="input-icon" />

                  <input
                    type="text"
                    placeholder="Enter your Admin ID"
                    value={adminId}
                    onChange={(e) =>
                      setAdminId(e.target.value)
                    }
                  />

                </div>

              </div>

            )}


            {/* PASSWORD */}

            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <FaLock className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>


            {/* REMEMBER ME ONLY */}

            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                Remember me

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >

              <FaSignInAlt />

              {loading
                ? "Logging in..."
                : `Login as ${
                    role === "student"
                      ? "Student"
                      : "Admin"
                  }`
              }

            </button>

          </form>


          <div className="security-note">
            🔒 Your account is protected with secure authentication
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;