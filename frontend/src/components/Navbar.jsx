import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";

export default function Navbar() {
  const { user } = useContext(AuthContext);
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

      <button onClick={() => navigate("/events")}>Events</button>

      {user && (
        <>
          <button onClick={() => navigate("/my-events")}>
            My Events
          </button>
          <button onClick={() => navigate("/certificates")}>
            Certificates
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