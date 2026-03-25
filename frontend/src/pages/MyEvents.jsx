import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

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
      console.log(error);
    } else {
      const eventList = data.map((item) => item.events);
      setEvents(eventList);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Events</h1>

      {events.length === 0 ? (
        <p>No events joined yet</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid gray",
                padding: "15px",
                width: "250px",
                borderRadius: "10px",
                boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><b>Date:</b> {event.date}</p>
              <p><b>Location:</b> {event.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}