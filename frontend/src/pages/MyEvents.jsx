import { useEffect, useState, useContext, useRef } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";
import { QRCode } from "react-qr-code";
import * as htmlToImage from "html-to-image";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]); // ✅ ALWAYS ARRAY
  const refs = useRef({});

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      // 1️⃣ Get registrations
      const { data: regData, error: regError } = await supabase
        .from("registrations")
        .select("event_id")
        .eq("user_id", user.id);

      if (regError) {
        console.error(regError);
        return;
      }

      if (!regData || regData.length === 0) {
        setEvents([]);
        return;
      }

      // 2️⃣ Extract event IDs
      const eventIds = regData.map((r) => r.event_id);

      // 3️⃣ Fetch events
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      if (eventError) {
        console.error(eventError);
        return;
      }

      setEvents(eventData || []);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  const downloadTicket = async (eventId) => {
    try {
      const node = refs.current[eventId];
      if (!node) return;

      const dataUrl = await htmlToImage.toPng(node);

      const link = document.createElement("a");
      link.download = "ticket.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // 🔒 Prevent crash if user not loaded yet
  if (!user) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Events 🎟️</h1>

      {/* ✅ SAFE CHECK */}
      {!Array.isArray(events) || events.length === 0 ? (
        <p>No events joined yet</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {events.map((event) => {
            const qrValue = `${user.email}-${event.id}`;

            return (
              <div key={event.id}>
                <div
                  ref={(el) => (refs.current[event.id] = el)}
                  style={{
                    border: "1px solid gray",
                    padding: "15px",
                    width: "260px",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p><b>Date:</b> {event.date}</p>
                  <p><b>Location:</b> {event.location}</p>

                  <QRCode value={qrValue} size={120} />
                  <p style={{ fontSize: "12px" }}>Scan for entry</p>
                </div>

                <button onClick={() => downloadTicket(event.id)}>
                  Download Ticket 📥
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}