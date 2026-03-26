import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    if (user) fetchRegistrations();
  }, [user]);

  // 🔥 Fetch all events
  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data);
    }
  };

  // 🔥 Fetch registered events for current user
  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching registrations:", error);
    } else {
      const ids = data.map((r) => r.event_id);
      setRegisteredEvents(ids);
    }
  };

  // 🔥 Register (SAFE — no duplicate)
  const handleRegister = async (eventId) => {
    try {
      // Check existing
      const { data: existing } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (existing.length > 0) {
        alert("Already registered");
        return;
      }

      // Insert
      const { error } = await supabase.from("registrations").insert([
        {
          user_id: user.id,
          event_id: eventId,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Error registering");
      } else {
        alert("✅ Registered successfully");
        fetchRegistrations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Exit event
  const handleExit = async (eventId) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (error) {
        console.error(error);
        alert("Error exiting event");
      } else {
        alert("❌ Exited event");
        fetchRegistrations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Events</h2>

      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => {
          const isRegistered = registeredEvents.includes(event.id);

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

              {user ? (
                isRegistered ? (
                  <button onClick={() => handleExit(event.id)}>
                    Exit Event ❌
                  </button>
                ) : (
                  <button onClick={() => handleRegister(event.id)}>
                    Register ✅
                  </button>
                )
              ) : (
                <p style={{ color: "red" }}>Login to register</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}