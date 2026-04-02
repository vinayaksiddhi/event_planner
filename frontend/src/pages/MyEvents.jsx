import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  const fetchMyEvents = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("events(*)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error:", error);
      return;
    }

    const eventList = data
      .map((item) => item.events)
      .filter((e) => e !== null);

    setEvents(eventList);
  };

  const downloadQR = (eventId) => {
    const canvas = document.getElementById(`qr-${eventId}`);
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `event-${eventId}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div style={page}>
      <h2 style={title}>🎟️ My Events</h2>

      {events.length === 0 ? (
        <p style={{ textAlign: "center" }}>No events joined yet</p>
      ) : (
        <div style={grid}>
          {events.map((event) => {
            const safeTitle = event.title.replace(/\s/g, "_");
            const qrValue = `${safeTitle}|${event.id}|${user.id}`;

            return (
              <div key={event.id} style={card}>
                <h3 style={eventTitle}>{event.title}</h3>

                <p style={desc}>{event.description}</p>

                <div style={info}>
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                </div>

                <div style={qrBox}>
                  <QRCodeCanvas
                    id={`qr-${event.id}`}
                    value={qrValue}
                    size={140}
                  />
                </div>

                <p style={scanText}>Scan for entry</p>

                <button
                  onClick={() => downloadQR(event.id)}
                  style={btn}
                >
                  Download QR ⬇️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* 🔥 STYLES */

const page = {
  minHeight: "calc(100vh - 70px)",
  padding: "30px",
  background: "linear-gradient(to right, #e0f2fe, #f0f9ff)",
};

const title = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "28px",
  color: "#2563eb", 
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "25px",
};

const card = {
  width: "280px",
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  textAlign: "center",
  transition: "0.3s",
};

const eventTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const desc = {
  fontSize: "14px",
  color: "#555",
};

const info = {
  fontSize: "13px",
  marginTop: "10px",
  marginBottom: "10px",
};

const qrBox = {
  margin: "15px 0",
  display: "flex",
  justifyContent: "center",
};

const scanText = {
  fontSize: "13px",
  color: "#64748b",
};

const btn = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #3b82f6, #6366f1)",
  color: "white",
  cursor: "pointer",
};