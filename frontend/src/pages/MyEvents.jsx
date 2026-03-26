import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";
import QRCode from "react-qr-code";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  const fetchMyEvents = async () => {
    const { data: registrations } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    if (!registrations || registrations.length === 0) {
      setEvents([]);
      return;
    }

    const eventIds = registrations.map((r) => r.event_id);

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds);

    setEvents(eventsData || []);
  };

  // 🔥 DOWNLOAD QR FUNCTION
  const downloadQR = (eventId) => {
    const svg = document.getElementById(`qr-${eventId}`);
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = 200;
      canvas.height = 200;
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `event-${eventId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Events 🎟️</h2>

      {events.length === 0 ? (
        <p>No events joined yet</p>
      ) : (
        events.map((event) => (
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

            {/* 🔥 QR */}
            <div id={`qr-${event.id}`}>
              <QRCode
                value={`${user.id}-${event.id}`}
                size={150}
              />
            </div>

            <p>Scan for entry</p>

            {/* 🔥 DOWNLOAD BUTTON */}
            <button onClick={() => downloadQR(event.id)}>
              Download QR
            </button>
          </div>
        ))
      )}
    </div>
  );
}