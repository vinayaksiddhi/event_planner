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
    <div
      style={{
        width: "100%",
        padding: "12px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to right, #1e3a8a, #2563eb)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* LOGO */}
      <h2
        style={{ cursor: "pointer", margin: 0 }}
        onClick={() => navigate("/events")}
      >
        🎟️ Event Planner
      </h2>

      {/* CENTER NAV */}
      <div style={{ display: "flex", gap: "12px" }}>
        <NavButton onClick={() => navigate("/events")}>
          Events
        </NavButton>

        {/* USER */}
        {user && role !== "admin" && (
          <>
            <NavButton onClick={() => navigate("/my-events")}>
              My Events
            </NavButton>

            <NavButton onClick={() => navigate("/certificates")}>
              Certificates
            </NavButton>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <NavButton onClick={() => navigate("/create")}>
              Create
            </NavButton>

            <NavButton onClick={() => navigate("/scan")}>
              Scan QR
            </NavButton>

            <NavButton onClick={() => navigate("/admin-certificates")}>
              Certificates
            </NavButton>

            <NavButton onClick={() => navigate("/attendance")}>
              Attendance
            </NavButton>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user ? (
          <>
            <span style={{ fontSize: "14px" }}>{user.email}</span>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={authBtn}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{ ...authBtn, background: "#10b981" }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* 🔥 REUSABLE NAV BUTTON */
function NavButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.2)",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseOver={(e) => (e.target.style.background = "rgba(255,255,255,0.35)")}
      onMouseOut={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
    >
      {children}
    </button>
  );
}

/* 🔐 AUTH BUTTON */
const authBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};