import { useState } from "react";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        <h2 style={title}>Welcome Back 👋</h2>

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

        <button onClick={handleLogin} style={button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={text}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={link}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

/* 🔥 STYLES */

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
  background: "linear-gradient(to right, #3b82f6, #6366f1)",
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