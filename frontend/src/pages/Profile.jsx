import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";

export default function Profile() {
  const { user, role } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.name || "");
      setCollege(data.college || "");
      setDob(data.dob || "");
      setPhone(data.phone || "");
      setGender(data.gender || "");
      setYear(data.year || "");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        name,
        college,
        dob,
        phone,
        gender,
        year,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert("Error saving profile");
      console.error(error);
    } else {
      alert("✅ Profile updated");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>👤 Profile</h2>

        {/* USER INFO */}
        <div style={infoBox}>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Role:</b> {role}</p>
        </div>

        {/* FORM */}
        <div style={form}>
          <input
            style={input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={input}
            placeholder="College"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />

          <input
            style={input}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <input
            style={input}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <select
            style={input}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <select
            style={input}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
        </div>

        <button onClick={handleSave} style={btn}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

/* 🔥 STYLES */

const page = {
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #e0f2fe, #f8fafc)",
};

const card = {
  width: "360px",
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  marginBottom: "15px",
};

const infoBox = {
  fontSize: "14px",
  marginBottom: "15px",
  padding: "10px",
  background: "#f1f5f9",
  borderRadius: "10px",
};

const form = {
  display: "flex",
  flexDirection: "column",
};

const input = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const btn = {
  marginTop: "10px",
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #22c55e, #4ade80)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};