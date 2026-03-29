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

  // 🔥 DOWNLOAD QR FUNCTION
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
    <div style={{ padding: "20px" }}>
      <h2>My Events 🎟️</h2>

      {events.length === 0 ? (
        <p>No events joined yet</p>
      ) : (
        events.map((event) => {
          // 🔥 SAFE EVENT NAME (no spaces)
          const safeTitle = event.title.replace(/\s/g, "_");

          // 🔥 FINAL QR VALUE
          const qrValue = `${safeTitle}|${event.id}|${user.id}`;

          console.log("QR:", qrValue); // debug

          return (
            <div
              key={event.id}
              style={{
                border: "1px solid gray",
                padding: "15px",
                margin: "10px",
                borderRadius: "10px",
                width: "300px",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><b>Date:</b> {event.date}</p>
              <p><b>Location:</b> {event.location}</p>

              {/* ✅ UPDATED QR */}
              <QRCodeCanvas
                id={`qr-${event.id}`}
                value={qrValue}
                size={150}
              />

              <p>Scan for entry</p>

              <button onClick={() => downloadQR(event.id)}>
                Download QR ⬇️
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}