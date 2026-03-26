import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScanQR from "./pages/ScanQR";

// 🆕 Certificate Pages
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
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PROTECTED */}
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
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

        {/* 🆕 USER: VIEW & DOWNLOAD CERTIFICATES */}
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          }
        />

        {/* 🆕 ADMIN: UPLOAD CERTIFICATES */}
        <Route
          path="/upload-certificate"
          element={
            <AdminRoute>
              <UploadCertificate />
            </AdminRoute>
          }
        />

        {/* 🆕 ADMIN: MANAGE ALL CERTIFICATES */}
        <Route
          path="/admin-certificates"
          element={
            <AdminRoute>
              <AdminCertificates />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}