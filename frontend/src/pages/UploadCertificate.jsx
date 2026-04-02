import { useState, useEffect } from "react";
import supabase from "../services/supabase";

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch Events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      console.error(error);
    } else {
      setEvents(data);
    }
  };

  // 🔥 FINAL UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file || !email || !eventId) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      // ✅ Clean filename
      const cleanName = file.name.replace(/\s/g, "_");
      const fileName = `${Date.now()}-${cleanName}`;

      // ✅ Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error(uploadError);
        alert(uploadError.message);
        return;
      }

      // ✅ Get Public URL
      const { data: publicData } = supabase.storage
        .from("certificates")
        .getPublicUrl(fileName);

      const fileUrl = publicData.publicUrl;

      console.log("Uploaded URL:", fileUrl);

      // ✅ Save in Supabase DB
      const { error: dbError } = await supabase.from("certificates").insert([
        {
          email,
          event_id: eventId,
          file_url: fileUrl,
        },
      ]);

      if (dbError) {
        console.error(dbError);
        alert("Database error");
        return;
      }

      alert("✅ Certificate uploaded successfully");

      // 🔄 Reset
      setFile(null);
      setEmail("");
      setEventId("");

    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>🎓 Upload Certificate</h2>

        {/* EMAIL */}
        <input
          style={input}
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* EVENT DROPDOWN */}
        <select
          style={input}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.date})
            </option>
          ))}
        </select>

        {/* FILE INPUT */}
        <input
          style={input}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* FILE NAME */}
        {file && <p style={fileText}>📄 {file.name}</p>}

        {/* BUTTON */}
        <button onClick={handleUpload} style={btn} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
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
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const title = {
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

const fileText = {
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "10px",
};

const btn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #22c55e, #4ade80)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};