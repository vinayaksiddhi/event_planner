import { useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function CreateEvent() {
  const { user, role } = useContext(AuthContext);

  // 🔒 ADMIN PROTECTION
  if (role !== "admin") {
    return <h2 style={{ padding: "20px" }}>Access Denied 🚫</h2>;
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = async () => {
    if (!title || !date) {
      alert("Title and Date are required");
      return;
    }

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
        created_by: user.id, // 🔥 link to admin
      },
    ]);

    if (error) {
      alert("Error creating event");
      console.log(error);
      return;
    }

    alert("✅ Event Created");

    // reset form
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Event</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}