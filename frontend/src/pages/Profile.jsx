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
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Profile 👤</h2>

      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {role}</p>

      <br />

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="College"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      />
      <br /><br />

      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setGender(e.target.value)} value={gender}>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>
      <br /><br />

      <select onChange={(e) => setYear(e.target.value)} value={year}>
        <option value="">Year</option>
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
        <option>4th Year</option>
      </select>
      <br /><br />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}