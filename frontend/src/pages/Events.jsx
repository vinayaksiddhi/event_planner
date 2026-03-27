import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const { user, role } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchAllRegistrations();
    if (user) {
      fetchRegistrations();
      fetchAttendance();
    }
  }, [user]);

  // 🔥 Fetch events
  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) console.error(error);
    else setEvents(data || []);
  };

  // 🔥 Fetch ALL registrations (for count)
  const fetchAllRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*");

    setAllRegistrations(data || []);
  };

  // 🔥 Fetch MY registrations
  const fetchRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    const ids = data?.map((r) => r.event_id) || [];
    setRegisteredEvents(ids);
  };

  // 🔥 Fetch attendance
  const fetchAttendance = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id);

    setAttendance(data || []);
  };

  // 🔥 Count participants
  const getCount = (eventId) => {
    return allRegistrations.filter(
      (r) => r.event_id === eventId
    ).length;
  };

  // 🔥 Status check
  const getStatus = (eventId) => {
    const isRegistered = registeredEvents.includes(eventId);
    const isAttended = attendance.some(
      (a) => a.event_id === eventId
    );

    if (isAttended) return "attended";
    if (isRegistered) return "registered";
    return "none";
  };

  // 🔥 Register
  const handleRegister = async (eventId) => {
    try {
      const { data: existing } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (existing.length > 0) {
        alert("Already registered");
        return;
      }

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
        fetchAllRegistrations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Exit
  const handleExit = async (eventId) => {
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
      fetchAllRegistrations();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Events 🎉</h2>

      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => {
          const count = getCount(event.id);
          const status = getStatus(event.id);
          const isFull = count >= (event.max_participants || 50);

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

              {/* 👥 COUNT */}
              <p>
                👥 {count} / {event.max_participants || 50}
              </p>

              {/* 🔥 BUTTON LOGIC */}
              {user && role !== "admin" ? (
                status === "attended" ? (
                  <button disabled style={{ background: "green", color: "white" }}>
                    Attended ✅
                  </button>
                ) : status === "registered" ? (
                  <button onClick={() => handleExit(event.id)}>
                    Exit ❌
                  </button>
                ) : isFull ? (
                  <button disabled style={{ background: "gray" }}>
                    Full 🚫
                  </button>
                ) : (
                  <button onClick={() => handleRegister(event.id)}>
                    Register 🎯
                  </button>
                )
              ) : (
                <p style={{ color: "red" }}>
                  {role === "admin"
                    ? "Admin cannot register"
                    : "Login to register"}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}