import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", gap: "15px", padding: "10px" }}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Event Planner
      </h2>

      {/* EVENTS ALWAYS */}
      <button onClick={() => navigate("/events")}>Events</button>

      {/* 👤 USER ONLY */}
      {user && role !== "admin" && (
        <>
          <button onClick={() => navigate("/my-events")}>
            My Events
          </button>

          <button onClick={() => navigate("/certificates")}>
            Certificates
          </button>
        </>
      )}

      {/* 👨‍💼 ADMIN ONLY */}
      {role === "admin" && (
        <>
          <button onClick={() => navigate("/create")}>
            Create Event
          </button>

          <button onClick={() => navigate("/scan")}>
            Scan QR
          </button>

          <button onClick={() => navigate("/admin-certificates")}>
            Manage Certificates
          </button>
          
          <button onClick={() => navigate("/attendance")}>
            Attendance
          </button>
        </>
      )}

      {/* 🔐 AUTH */}
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>
            Register
          </button>
        </>
      )}
    </div>
  );
}