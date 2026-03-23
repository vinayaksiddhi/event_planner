import { useState } from "react";
import supabase from "../services/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          role: "user"
        }
      ]);

      alert("Signup successful!");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Register</button>
    </div>
  );
}