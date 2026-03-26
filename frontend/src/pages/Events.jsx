import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    if (user) fetchJoined();
  }, [user]);

  // 🔥 Fetch all events
  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*");
    setEvents(data || []);
  };

  // 🔥 Fetch joined events
  const fetchJoined = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    setJoinedEvents(data.map((e) => e.event_id));
  };

  // 🔥 JOIN EVENT
  const joinEvent = async (eventId) => {
    await supabase.from("registrations").insert([
      {
        user_id: user.id,
        event_id: eventId,
      },
    ]);

    fetchJoined();
  };

  // 🔥 EXIT EVENT
  const exitEvent = async (eventId) => {
    await supabase
      .from("registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    fetchJoined();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Events</h2>

      {events.map((event) => {
        const isJoined = joinedEvents.includes(event.id);

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              margin: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{event.title}</h3>
            <p>{event.description}</p>

            {user && (
              isJoined ? (
                <button onClick={() => exitEvent(event.id)}>
                  Exit ❌
                </button>
              ) : (
                <button onClick={() => joinEvent(event.id)}>
                  Join ✅
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}