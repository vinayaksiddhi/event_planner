import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScanQR from "./pages/ScanQR";

// 🔥 NEW PAGES
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";

// 🔥 Certificate Pages
import UploadCertificate from "./pages/UploadCertificate";
import Certificates from "./pages/Certificates";
import AdminCertificates from "./pages/AdminCertificates";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👤 USER ROUTES */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          }
        />

        {/* 🔥 PROFILE (USER + ADMIN) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 👨‍💼 ADMIN ROUTES */}
        <Route
          path="/create"
          element={
            <AdminRoute>
              <CreateEvent />
            </AdminRoute>
          }
        />

        <Route
          path="/scan"
          element={
            <AdminRoute>
              <ScanQR />
            </AdminRoute>
          }
        />

        {/* 🔥 ATTENDANCE PAGE */}
        <Route
          path="/attendance"
          element={
            <AdminRoute>
              <Attendance />
            </AdminRoute>
          }
        />

        <Route
          path="/upload-certificate"
          element={
            <AdminRoute>
              <UploadCertificate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-certificates"
          element={
            <AdminRoute>
              <AdminCertificates />
            </AdminRoute>
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}