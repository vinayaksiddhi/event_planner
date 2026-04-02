import { useState } from "react";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    const { error: dbError } = await supabase.from("users").insert([
      {
        id: userId,
        email: email,
        role: role,
      },
    ]);

    setLoading(false);

    if (dbError) {
      console.error(dbError);
      alert("Error saving user role");
      return;
    }

    alert("✅ Registered successfully!");
    navigate("/login");
  };

  return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        <h2 style={title}>Create Account 🚀</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={input}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleSignup} style={button}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={text}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

/* 🔥 STYLES (same as login for consistency) */

const bgStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
};

const cardStyle = {
  backdropFilter: "blur(15px)",
  background: "rgba(255,255,255,0.1)",
  padding: "30px",
  borderRadius: "20px",
  width: "320px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  textAlign: "center",
  color: "white",
};

const title = {
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.2)",
  color: "white",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #22c55e, #4ade80)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};

const text = {
  marginTop: "15px",
  fontSize: "14px",
};

const link = {
  color: "#93c5fd",
  cursor: "pointer",
};