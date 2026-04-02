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
    <div style={navbar}>
      {/* LOGO */}
      <div style={logo} onClick={() => navigate("/events")}>
        🎟️ Event Planner
      </div>

      {/* CENTER NAV */}
      <div style={navCenter}>
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

            <NavButton onClick={() => navigate("/profile")}>
              Profile
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

            <NavButton onClick={() => navigate("/upload-certificate")}>
              Upload Cert
            </NavButton>

            <NavButton onClick={() => navigate("/admin-certificates")}>
              All Certificates
            </NavButton>
            <NavButton onClick={() => navigate("/attendance")}>
              Attendance
            </NavButton>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={navRight}>
        {user ? (
          <>
            <span style={email}>{user.email}</span>

            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={loginBtn}>
              Login
            </button>

            <button onClick={() => navigate("/register")} style={registerBtn}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* 🔥 NAVBAR STYLE */
const navbar = {
  width: "100%",
  height: "70px",
  padding: "0 20px", // ✅ FIXED (no overflow)
  boxSizing: "border-box", // ✅ VERY IMPORTANT
  overflowX: "hidden", // extra safety
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backdropFilter: "blur(10px)",
  background: "linear-gradient(to right, #1e3a8a, #2563eb)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
};

/* LOGO */
const logo = {
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

/* CENTER NAV */
const navCenter = {
  display: "flex",
  gap: "12px",
};

/* RIGHT SIDE */
const navRight = {
  display: "flex",
  alignItems: "center",
  gap: "8px", // ✅ tighter spacing
};

/* EMAIL */
const email = {
  fontSize: "13px",
  opacity: 0.9,
};

/* NAV BUTTON */
function NavButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={navBtn}
      onMouseEnter={(e) =>
        (e.target.style.background = "rgba(255,255,255,0.35)")
      }
      onMouseLeave={(e) =>
        (e.target.style.background = "rgba(255,255,255,0.2)")
      }
    >
      {children}
    </button>
  );
}

const navBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "500",
};

/* BUTTONS */
const loginBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const registerBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#22c55e",
  color: "white",
  cursor: "pointer",
};

const logoutBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};