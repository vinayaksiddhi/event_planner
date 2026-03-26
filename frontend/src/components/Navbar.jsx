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
      <h2 onClick={() => navigate("/")}>Event Planner</h2>

      <button onClick={() => navigate("/events")}>Events</button>

      {user && (
        <>
          <button onClick={() => navigate("/my-events")}>My Events</button>
          <button onClick={() => navigate("/certificates")}>
            My Certificates
          </button>
        </>
      )}

      {role === "admin" && (
        <>
          <button onClick={() => navigate("/create")}>Create</button>
          <button onClick={() => navigate("/scan")}>Scan QR</button>
          <button onClick={() => navigate("/upload-certificate")}>
            Upload Cert
          </button>
          <button onClick={() => navigate("/admin-certificates")}>
            Manage Certs
          </button>
        </>
      )}

      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </>
      )}
    </div>
  );
}