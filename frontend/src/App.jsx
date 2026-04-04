import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// 🔥 Components
import Navbar from "./components/Navbar";

// 🔥 Pages
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScanQR from "./pages/ScanQR";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import UploadEventPhotos from "./pages/UploadEventPhotos";
import Photos from "./pages/Photos";
import Home from "./pages/Home";

// 🔥 Certificate Pages
import UploadCertificate from "./pages/UploadCertificate";
import Certificates from "./pages/Certificates";
import AdminCertificates from "./pages/AdminCertificates";

// 🔥 Routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// 🔥 Auth
import { AuthContext } from "./context/AuthContext";

// 🔥 MAIN ROUTES FUNCTION
function AppRoutes() {
  const { user, role } = useContext(AuthContext);

  return (
    <Routes>
       {/* ================= PUBLIC ROUTES ================= */}
  <Route path="/" element={<Home />} />
  <Route path="/events" element={<Events />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
      {/* ================= USER ROUTES ================= */}

      {/* 🔥 My Events (BLOCK ADMIN) */}
      <Route
        path="/my-events"
        element={
          user ? (
            role !== "admin" ? (
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 🔥 Certificates (BLOCK ADMIN) */}
      <Route
        path="/certificates"
        element={
          user ? (
            role !== "admin" ? (
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ================= ADMIN ROUTES ================= */}

      <Route
        path="/create"
        element={
          user ? (
            role === "admin" ? (
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/scan"
        element={
          user ? (
            role === "admin" ? (
              <AdminRoute>
                <ScanQR />
              </AdminRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/upload-certificate"
        element={
          user ? (
            role === "admin" ? (
              <AdminRoute>
                <UploadCertificate />
              </AdminRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin-certificates"
        element={
          user ? (
            role === "admin" ? (
              <AdminRoute>
                <AdminCertificates />
              </AdminRoute>
            ) : (
              <Navigate to="/events" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/attendance"
        element={
          <AdminRoute>
            <Attendance />
          </AdminRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<h2>Page Not Found ❌</h2>} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-photos"
        element={
          <AdminRoute>
            <UploadEventPhotos />
          </AdminRoute>
        }
      />
      <Route
        path="/photos"
        element={
          <ProtectedRoute>
            <Photos />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}

// 🔥 MAIN APP
export default function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}