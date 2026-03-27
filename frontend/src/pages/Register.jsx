import { useState } from "react";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 🔥 NEW

  const handleSignup = async () => {
    // 🔐 Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    // 🔥 Insert into users table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: userId,
        email: email,
        role: role, // "user" or "admin"
      },
    ]);

    if (dbError) {
      console.error(dbError);
      alert("Error saving user role");
      return;
    }

    alert("✅ Registered successfully! Please login.");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {/* 🔥 ROLE SELECT */}
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <br /><br />

      <button onClick={handleSignup}>Register</button>
    </div>
  );
}