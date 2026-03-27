import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "15px",
        background: "#111",
        color: "#fff",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* 🔥 LOGO */}
      <h2
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/events")}
      >
        Event Planner
      </h2>

      {/* 👤 USER LINKS */}
      {user && (
        <>
          <button onClick={() => navigate("/events")}>Events</button>

          <button onClick={() => navigate("/my-events")}>
            My Events
          </button>

          <button onClick={() => navigate("/certificates")}>
            Certificates
          </button>

          {/* 🔥 NEW */}
          <button onClick={() => navigate("/profile")}>
            Profile
          </button>
        </>
      )}

      {/* 👨‍💼 ADMIN LINKS */}
      {role === "admin" && (
        <>
          <button onClick={() => navigate("/create")}>
            Create Event
          </button>

          <button onClick={() => navigate("/scan")}>
            Scan QR
          </button>

          {/* 🔥 NEW */}
          <button onClick={() => navigate("/attendance")}>
            Attendance
          </button>

          <button onClick={() => navigate("/upload-certificate")}>
            Upload Certificate
          </button>

          <button onClick={() => navigate("/admin-certificates")}>
            Manage Certificates
          </button>
        </>
      )}

      {/* 🔐 RIGHT SIDE */}
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              {user.email}
            </span>

            <button
              onClick={() => {
                logout();
                navigate("/login"); // 🔥 ensures redirect
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>
              Login
            </button>

            <button onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}