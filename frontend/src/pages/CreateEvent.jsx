import { useState } from "react";
import supabase from "../services/supabase";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [loading, setLoading] = useState(false); // ✅ added safely

  const handleCreate = async () => {
    if (!title || !description || !date || !location) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
        max_participants: maxParticipants,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error creating event");
    } else {
      alert("✅ Event created");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setMaxParticipants(50); // ✅ small fix (reset properly)
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={titleStyle}>📅 Create Event</h2>

        <input
          style={input}
          placeholder="Event Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          style={input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          style={input}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          style={input}
          type="number"
          placeholder="Max Participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />

        <button onClick={handleCreate} style={btn} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );
}

/* 🔥 STYLES (ONLY UI, NO LOGIC CHANGE) */

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

const titleStyle = {
  textAlign: "center",
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #3b82f6, #6366f1)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};