import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ==========================================
// PROTECTED ROUTE
// ==========================================
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && storedRole !== role) {
    if (storedRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (storedRole === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

// ==========================================
// APP
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;