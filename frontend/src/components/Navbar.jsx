import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <h2>Event Planner</h2>

      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={() => supabase.auth.signOut()}>
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