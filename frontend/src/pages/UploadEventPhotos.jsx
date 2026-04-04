import { useState, useEffect } from "react";
import supabase from "../services/supabase";

export default function UploadEventPhotos() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [files, setFiles] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  // 📥 Fetch all events
  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*");
    setEvents(data || []);
  };

  // 🚀 Upload logic
  const handleUpload = async () => {
    if (!eventId || files.length === 0) {
      alert("Select event + images");
      return;
    }

    for (let file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      // 1️⃣ Upload to storage
      const { error } = await supabase.storage
        .from("event image")   // ✅ your bucket
        .upload(fileName, file);

      if (error) {
        alert("Upload failed");
        console.error(error);
        continue;
      }

      // 2️⃣ Get public URL
      const { data } = supabase.storage
        .from("event image")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      // 3️⃣ Save to DB
      await supabase.from("event_photos").insert([
        {
          event_id: eventId,
          image_url: imageUrl,
          team_name: teamName || null,
        },
      ]);
    }

    alert("✅ Images uploaded successfully");
    setFiles([]);
    setTeamName("");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2>📸 Upload Event Photos</h2>

        {/* EVENT SELECT */}
        <select
          style={input}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        {/* TEAM NAME */}
        <input
          style={input}
          placeholder="Team / Category (optional)"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {/* FILE INPUT */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          style={input}
        />

        <button style={btn} onClick={handleUpload}>
          Upload 🚀
        </button>
      </div>
    </div>
  );
}

/* UI */
const page = {
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "350px",
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
};