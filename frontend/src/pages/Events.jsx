import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    if (user) fetchJoinedEvents();
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (!error) setEvents(data);
  };

  const fetchJoinedEvents = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    if (!error) {
      const ids = data.map((item) => item.event_id);
      setJoinedEvents(ids);
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    const { error } = await supabase.from("registrations").insert([
      { user_id: user.id, event_id: eventId }
    ]);

    if (!error) {
      alert("Joined successfully!");
      fetchJoinedEvents();
    }
  };

  const handleLeave = async (eventId) => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    if (!error) {
      alert("Left event!");
      fetchJoinedEvents();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Events</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {events.map((event) => {
          const isJoined = joinedEvents.includes(event.id);

          return (
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

              {isJoined ? (
                <button onClick={() => handleLeave(event.id)}>
                  Leave Event ❌
                </button>
              ) : (
                <button onClick={() => handleRegister(event.id)}>
                  Join Event
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}