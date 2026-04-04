import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dropdownRef = useRef(null);

  // ✅ responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ click outside close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUploadOpen(false);
        setManageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <div style={navbar} ref={dropdownRef}>
        {/* LOGO */}
        <div style={logo} onClick={() => navigate("/events")}>
          🎟️ Event Planner
        </div>

        {/* DESKTOP */}
        {!isMobile && (
          <div style={navCenter}>
            <NavButton onClick={() => navigate("/events")}>Events</NavButton>

            {user && role !== "admin" && (
              <>
                <NavButton onClick={() => navigate("/my-events")}>
                  My Events
                </NavButton>

                <NavButton onClick={() => navigate("/certificates")}>
                  Certificates
                </NavButton>

                <NavButton onClick={() => navigate("/photos")}>
                  Photos
                </NavButton>
              </>
            )}

            {/* UPLOAD */}
            {role === "admin" && (
              <Dropdown
                title="Upload"
                open={uploadOpen}
                setOpen={setUploadOpen}
              >
                <DropItem onClick={() => navigate("/upload-certificate")}>
                  Certificates
                </DropItem>
                <DropItem onClick={() => navigate("/upload-photos")}>
                  Photos
                </DropItem>
              </Dropdown>
            )}

            {/* MANAGE */}
            {role === "admin" && (
              <Dropdown
                title="Manage"
                open={manageOpen}
                setOpen={setManageOpen}
              >
                <DropItem onClick={() => navigate("/create")}>
                  Create Event
                </DropItem>
                <DropItem onClick={() => navigate("/scan")}>
                  Scan QR
                </DropItem>
                <DropItem onClick={() => navigate("/attendance")}>
                  Attendance
                </DropItem>
                <DropItem onClick={() => navigate("/admin-certificates")}>
                  Certificates
                </DropItem>
              </Dropdown>
            )}
          </div>
        )}

        {/* RIGHT */}
        {!isMobile && (
          <div style={navRight}>
            {user ? (
              <>
                <span style={email}>{user.email}</span>

                <button
                  onClick={() => navigate("/profile")}
                  style={profileBtn}
                >
                  Profile
                </button>

                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} style={loginBtn}>
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={registerBtn}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}

        {/* MOBILE */}
        {isMobile && (
          <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={mobileMenu}>
          <MobileItem onClick={() => navigate("/events")}>Events</MobileItem>

          {role === "admin" && (
            <>
              <MobileItem onClick={() => navigate("/create")}>
                Create Event
              </MobileItem>
              <MobileItem onClick={() => navigate("/upload-photos")}>
                Upload Photos
              </MobileItem>
              <MobileItem onClick={() => navigate("/upload-certificate")}>
                Upload Cert
              </MobileItem>
              <MobileItem onClick={() => navigate("/attendance")}>
                Attendance
              </MobileItem>
            </>
          )}

          {user ? (
            <>
              <MobileItem onClick={() => navigate("/profile")}>
                Profile
              </MobileItem>
              <MobileItem onClick={handleLogout}>Logout</MobileItem>
            </>
          ) : (
            <>
              <MobileItem onClick={() => navigate("/login")}>Login</MobileItem>
              <MobileItem onClick={() => navigate("/register")}>
                Register
              </MobileItem>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ===== COMPONENTS ===== */

function Dropdown({ title, children, open, setOpen }) {
  return (
    <div style={dropdownContainer}>
      <button style={navBtn} onClick={() => setOpen(!open)}>
        {title} ⌄
      </button>

      {open && <div style={dropdown}>{children}</div>}
    </div>
  );
}

function DropItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={dropItem}
      onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
      onMouseLeave={(e) => (e.target.style.background = "white")}
    >
      {children}
    </div>
  );
}

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

function MobileItem({ children, onClick }) {
  return (
    <div onClick={onClick} style={mobileItem}>
      {children}
    </div>
  );
}

/* ===== STYLES ===== */

const navbar = {
  height: "70px",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "linear-gradient(to right, #1e3a8a, #2563eb)",
  color: "white",
};

const logo = { fontWeight: "bold", cursor: "pointer" };

const navCenter = { display: "flex", gap: "12px" };
const navRight = { display: "flex", gap: "10px", alignItems: "center" };

const email = {
  fontSize: "12px",
  maxWidth: "140px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const navBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};

const dropdownContainer = { position: "relative" };

const dropdown = {
  position: "absolute",
  top: "45px",
  left: 0,
  background: "white",
  color: "black",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  minWidth: "180px",
  zIndex: 1000,
};

const dropItem = {
  padding: "10px 15px",
  cursor: "pointer",
};

const profileBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  background: "#22c55e",
  color: "white",
  border: "none",
};

const logoutBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  background: "#ef4444",
  color: "white",
  border: "none",
};

const loginBtn = { padding: "6px", background: "#3b82f6", color: "white" };
const registerBtn = { padding: "6px", background: "#22c55e", color: "white" };

const hamburger = { fontSize: "22px", cursor: "pointer" };

const mobileMenu = {
  background: "white",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
};

const mobileItem = { padding: "10px", cursor: "pointer" };