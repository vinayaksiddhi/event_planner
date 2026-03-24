import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", gap: "20px", padding: "10px" }}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Event Planner
      </h2>

      <button onClick={() => navigate("/events")}>Events</button>

      {user ? (
        <>
          <button onClick={() => navigate("/create")}>
            Create Event
          </button>

          <span>{user.email}</span>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            Logout
          </button>
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