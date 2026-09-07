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
import { loginUser } from "../api/auth";
import { loginStudent } from "../api/student";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================
  const [role, setRole] = useState("student");

  const [studentId, setStudentId] = useState("");
  const [adminId, setAdminId] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // CHANGE ROLE
  // ==========================================
  const handleRoleChange = (newRole) => {
    if (loading) return;

    setRole(newRole);
    setPassword("");

    // Clear previous login field when switching roles
    if (newRole === "student") {
      setAdminId("");
    } else {
      setStudentId("");
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ==========================================
    // STUDENT VALIDATION
    // ==========================================
    if (role === "student") {
      if (!studentId.trim()) {
        alert("Please enter Student ID");
        return;
      }

      if (!password) {
        alert("Please enter Password");
        return;
      }
    }

    // ==========================================
    // ADMIN VALIDATION
    // ==========================================
    if (role === "admin") {
      if (!adminId.trim()) {
        alert("Please enter Admin Email");
        return;
      }

      if (!password) {
        alert("Please enter Password");
        return;
      }
    }

    setLoading(true);

    try {
      // ==========================================
      // STUDENT LOGIN
      // ==========================================
      if (role === "student") {
        const loginData = {
          username: studentId.trim(),
          password,
        };

        // Debug - check exactly what is being sent
        console.log("STUDENT LOGIN DATA:", loginData);

        const response = await loginStudent(
          loginData.username,
          loginData.password
        );

        console.log("STUDENT LOGIN RESPONSE:", response);

        // Check token
        if (!response?.token) {
          throw new Error("Student login failed. Token not received.");
        }

        // ==========================================
        // SAVE STUDENT AUTHENTICATION
        // ==========================================
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", "student");

        // Save student information if returned
        if (response.student) {
          localStorage.setItem(
            "student",
            JSON.stringify(response.student)
          );
        }

        // ==========================================
        // GO TO STUDENT DASHBOARD
        // ==========================================
        navigate("/student-dashboard", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // ADMIN LOGIN
      // ==========================================
      if (role === "admin") {
        const loginData = {
          email: adminId.trim(),
          password: password,
        };

        // Debug - check exactly what is being sent
        console.log("ADMIN LOGIN DATA:", loginData);

        const response = await loginUser(loginData);

        console.log("ADMIN LOGIN RESPONSE:", response);

        // Check token
        if (!response?.token) {
          throw new Error("Admin login failed. Token not received.");
        }

        // ==========================================
        // SAVE ADMIN AUTHENTICATION
        // ==========================================
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", "admin");

        // Save admin/user information if returned
        if (response.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.user)
          );
        }

        // ==========================================
        // GO TO ADMIN DASHBOARD
        // ==========================================
        navigate("/admin-dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      // Get backend error message
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please try again.";

      console.error("SERVER ERROR:", error?.response?.data);

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="login-page">

      {/* ==========================================
          LEFT SIDE
      ========================================== */}
      <div className="login-banner">
        <div className="overlay"></div>

        <div className="banner-content">

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

      {/* ==========================================
          RIGHT SIDE
      ========================================== */}
      <div className="login-container">

        <div className="login-box">

          {/* ==========================================
              HEADER
          ========================================== */}
          <div className="login-header">
            <h2>Welcome Back</h2>

            <p>
              Please login to access your account
            </p>
          </div>

          {/* ==========================================
              ROLE SELECTOR
          ========================================== */}
          <div className="role-selector">

            {/* STUDENT BUTTON */}
            <button
              type="button"
              className={`role-btn ${
                role === "student" ? "active" : ""
              }`}
              onClick={() => handleRoleChange("student")}
              disabled={loading}
            >
              <FaUserGraduate />

              <div>
                <strong>Student</strong>
                <small>Student Login</small>
              </div>
            </button>

            {/* ADMIN BUTTON */}
            <button
              type="button"
              className={`role-btn ${
                role === "admin" ? "active" : ""
              }`}
              onClick={() => handleRoleChange("admin")}
              disabled={loading}
            >
              <FaUserShield />

              <div>
                <strong>Admin</strong>
                <small>Administrator Login</small>
              </div>
            </button>

          </div>

          {/* ==========================================
              LOGIN FORM
          ========================================== */}
          <form onSubmit={handleLogin}>

            {/* ==========================================
                STUDENT INPUT
            ========================================== */}
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
                    disabled={loading}
                    autoComplete="username"
                  />

                </div>

              </div>
            ) : (

              /* ==========================================
                 ADMIN INPUT
              ========================================== */
              <div className="input-group">

                <label>Admin Email</label>

                <div className="input-wrapper">

                  <FaUserShield className="input-icon" />

                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    value={adminId}
                    onChange={(e) =>
                      setAdminId(e.target.value)
                    }
                    disabled={loading}
                    autoComplete="username"
                  />

                </div>

              </div>
            )}

            {/* ==========================================
                PASSWORD
            ========================================== */}
            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <FaLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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

            {/* ==========================================
                REMEMBER ME
            ========================================== */}
            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                Remember me

              </label>

            </div>

            {/* ==========================================
                LOGIN BUTTON
            ========================================== */}
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

          {/* ==========================================
              SECURITY MESSAGE
          ========================================== */}
          <div className="security-note">
            🔒 Your account is protected with secure authentication
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;