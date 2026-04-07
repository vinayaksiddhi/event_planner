import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";

export default function Navbar() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hidden, setHidden] = useState(false);

  const dropdownRef = useRef(null);

  /* 🔥 HIDE NAVBAR ON SCROLL */
  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > 100) setHidden(true);
      else setHidden(false);
    });
  }, [scrollY]);

  /* responsive */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* click outside */
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
      {/* 🔥 ANIMATED NAVBAR */}
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4 }}
        style={navbar}
        ref={dropdownRef}
      >
        {/* LOGO */}
        <div style={logo} onClick={() => navigate("/events")}>
          🎟️ Event Planner
        </div>

        {/* DESKTOP */}
        {!isMobile && (
          <div style={navCenter}>
            <NavButton onClick={() => navigate("/events")}>
              Events
            </NavButton>

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

            {role === "admin" && (
              <Dropdown title="Upload" open={uploadOpen} setOpen={setUploadOpen}>
                <DropItem onClick={() => navigate("/upload-certificate")}>
                  Certificates
                </DropItem>
                <DropItem onClick={() => navigate("/upload-photos")}>
                  Photos
                </DropItem>
              </Dropdown>
            )}

            {role === "admin" && (
              <Dropdown title="Manage" open={manageOpen} setOpen={setManageOpen}>
                <DropItem onClick={() => navigate("/create")}>
                  Create Event
                </DropItem>
                <DropItem onClick={() => navigate("/scan")}>
                  Scan QR
                </DropItem>
                <DropItem onClick={() => navigate("/attendance")}>
                  Attendance
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

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate("/profile")}
                  style={profileBtn}
                >
                  Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleLogout}
                  style={logoutBtn}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  style={modernBtn}
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  style={modernBtnGradient}
                >
                  Register
                </motion.button>
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
      </motion.div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={mobileMenu}
        >
          <MobileItem onClick={() => navigate("/events")}>Events</MobileItem>

          {role === "admin" && (
            <>
              <MobileItem onClick={() => navigate("/create")}>
                Create Event
              </MobileItem>
              <MobileItem onClick={() => navigate("/upload-photos")}>
                Upload Photos
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
        </motion.div>
      )}
    </>
  );
}

/* COMPONENTS SAME AS YOURS */

function Dropdown({ title, children, open, setOpen }) {
  return (
    <div style={{ position: "relative" }}>
      <button style={navBtn} onClick={() => setOpen(!open)}>
        {title} ⌄
      </button>
      {open && <div style={dropdown}>{children}</div>}
    </div>
  );
}

function DropItem({ children, onClick }) {
  return (
    <div onClick={onClick} style={dropItem}>
      {children}
    </div>
  );
}

function NavButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={navBtn}>
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

/* 🔥 UPDATED STYLES */

const navbar = {
  position: "fixed",
  top: 0,
  width: "100%",
  height: "70px",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(30, 58, 138, 0.7)",
  backdropFilter: "blur(20px)",
  color: "white",
  zIndex: 1000,
};

const logo = { fontWeight: "bold", cursor: "pointer" };

const navCenter = { display: "flex", gap: "12px" };
const navRight = { display: "flex", gap: "10px", alignItems: "center" };

const email = { fontSize: "12px" };

const navBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};

const dropdown = {
  position: "absolute",
  top: "45px",
  background: "white",
  color: "black",
  borderRadius: "12px",
};

const dropItem = { padding: "10px", cursor: "pointer" };

const profileBtn = { background: "#22c55e", color: "white" };
const logoutBtn = { background: "#ef4444", color: "white" };
const loginBtn = { background: "#3b82f6", color: "white" };
const registerBtn = { background: "#22c55e", color: "white" };

const hamburger = { fontSize: "22px", cursor: "pointer" };

const mobileMenu = {
  background: "white",
  padding: "15px",
};

const mobileItem = { padding: "10px", cursor: "pointer" };
const modernBtn = {
  padding: "8px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  backdropFilter: "blur(10px)",
  cursor: "pointer",
};

const modernBtnGradient = {
  padding: "8px 18px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(to right, #6366f1, #8b5cf6)",
  color: "white",
  fontWeight: "500",
  cursor: "pointer",
};