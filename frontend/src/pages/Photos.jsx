import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Photos() {
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*");
    setEvents(data || []);
  };

  const fetchPhotos = async (eventId) => {
    setSelectedEvent(eventId);

    const { data } = await supabase
      .from("event_photos")
      .select("*")
      .eq("event_id", eventId);

    setPhotos(data || []);
  };

  return (
    <div style={page}>
      <h2 style={title}>📸 Event Photos</h2>

      {/* EVENTS LIST */}
      <div style={eventList}>
        {events.map((e) => (
          <button
            key={e.id}
            style={eventBtn}
            onClick={() => fetchPhotos(e.id)}
          >
            {e.title}
          </button>
        ))}
      </div>

      {/* PHOTOS */}
      <div style={gallery}>
        {photos.length === 0 ? (
          <p>Select an event to view photos</p>
        ) : (
          photos.map((p) => (
            <img key={p.id} src={p.image_url} style={img} />
          ))
        )}
      </div>
    </div>
  );
}

/* STYLES */
const page = { padding: "20px" };

const title = { textAlign: "center", marginBottom: "20px" };

const eventList = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "20px",
};

const eventBtn = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const gallery = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center",
};

const img = {
  width: "200px",
  height: "140px",
  objectFit: "cover",
  borderRadius: "10px",
};