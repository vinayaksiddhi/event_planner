import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const { user, role } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // 🔥 EDIT STATE
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    max_participants: 50,
  });

  useEffect(() => {
    fetchEvents();
    fetchAllRegistrations();
    if (user) {
      fetchRegistrations();
      fetchAttendance();
    }
  }, [user]);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*");
    setEvents(data || []);
  };

  const fetchAllRegistrations = async () => {
    const { data } = await supabase.from("registrations").select("*");
    setAllRegistrations(data || []);
  };

  const fetchRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("user_id", user.id);

    setRegisteredEvents(data?.map((r) => r.event_id) || []);
  };

  const fetchAttendance = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id);

    setAttendance(data || []);
  };

  const getCount = (eventId) => {
    return allRegistrations.filter((r) => r.event_id === eventId).length;
  };

  const getStatus = (eventId) => {
    const isRegistered = registeredEvents.includes(eventId);
    const isAttended = attendance.some((a) => a.event_id === eventId);

    if (isAttended) return "attended";
    if (isRegistered) return "registered";
    return "none";
  };

  const handleRegister = async (eventId) => {
    const { data: existing } = await supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    if (existing.length > 0) {
      alert("Already registered");
      return;
    }

    await supabase.from("registrations").insert([
      { user_id: user.id, event_id: eventId },
    ]);

    alert("✅ Registered");
    fetchRegistrations();
    fetchAllRegistrations();
  };

  const handleExit = async (eventId) => {
    await supabase
      .from("registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    alert("❌ Exited");
    fetchRegistrations();
    fetchAllRegistrations();
  };

  // 🔥 EDIT
  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      max_participants: event.max_participants || 50,
    });
  };

  const handleUpdate = async () => {
    await supabase
      .from("events")
      .update(form)
      .eq("id", editingEvent.id);

    alert("✅ Updated");
    setEditingEvent(null);
    fetchEvents();
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    await supabase.from("events").delete().eq("id", id);

    alert("🗑️ Event deleted");
    fetchEvents();
  };

  return (
    <div style={{ padding: "30px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h2>🎉 Events</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {events.map((event) => {
          const count = getCount(event.id);
          const status = getStatus(event.id);
          const isFull = count >= (event.max_participants || 50);

          return (
            <div
              key={event.id}
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "20px",
                width: "280px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <p>📅 {event.date}</p>
              <p>📍 {event.location}</p>

              <p>👥 {count} / {event.max_participants || 50}</p>

              {/* USER BUTTON */}
              {user && role !== "admin" ? (
                status === "attended" ? (
                  <button style={{ width: "100%", background: "#0ea5e9" }}>
                    Attended ✅
                  </button>
                ) : status === "registered" ? (
                  <button
                    onClick={() => handleExit(event.id)}
                    style={{ width: "100%", background: "#ef4444" }}
                  >
                    Exit ❌
                  </button>
                ) : isFull ? (
                  <button style={{ width: "100%", background: "gray" }}>
                    Full 🚫
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(event.id)}
                    style={{ width: "100%", background: "#22c55e" }}
                  >
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

              {/* 🔥 ADMIN ACTIONS */}
              {role === "admin" && (
                <>
                  <button
                    onClick={() => handleEdit(event)}
                    style={{ width: "100%", marginTop: "10px", background: "#f59e0b" }}
                  >
                    Edit ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    style={{ width: "100%", marginTop: "5px", background: "#dc2626" }}
                  >
                    Delete 🗑️
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔥 MODERN MODAL */}
      {editingEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              width: "300px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3>Edit Event</h3>

            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <br /><br />

            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <br /><br />

            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <br /><br />

            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <br /><br />

            <input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} />
            <br /><br />

            <button onClick={handleUpdate}>Save ✅</button>
            <button onClick={() => setEditingEvent(null)}>Cancel ❌</button>
          </div>
        </div>
      )}
    </div>
  );
}