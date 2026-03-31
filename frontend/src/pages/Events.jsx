import { useEffect, useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function Events() {
  const { user, role } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);

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

  // ================= FETCH =================
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

  // ================= LOGIC =================
  const getCount = (eventId) =>
    allRegistrations.filter((r) => r.event_id === eventId).length;

  const getStatus = (eventId) => {
    if (attendance.some((a) => a.event_id === eventId)) return "attended";
    if (registeredEvents.includes(eventId)) return "registered";
    return "none";
  };

  // ================= ACTIONS =================
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

    fetchRegistrations();
    fetchAllRegistrations();
  };

  const handleExit = async (eventId) => {
    await supabase
      .from("registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    fetchRegistrations();
    fetchAllRegistrations();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm(event);
  };

  const handleUpdate = async () => {
    await supabase
      .from("events")
      .update(form)
      .eq("id", editingEvent.id);

    setEditingEvent(null);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete event?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  // ================= IMAGES =================
  const images = [
    "https://images.unsplash.com/photo-1511578314322-379afb476865",
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* HERO */}
      <div
        style={{
          height: "220px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Explore Events Near You 🚀
      </div>

      {/* TITLE */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🎉 Events</h2>
        <p style={{ color: "#64748b" }}>
          Discover amazing events happening around you 🎟️
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {events.map((event, index) => {
          const count = getCount(event.id);
          const status = getStatus(event.id);
          const isFull = count >= (event.max_participants || 50);

          return (
            <div
              key={event.id}
              style={{
                width: "300px",
                borderRadius: "16px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              }}
            >
              {/* IMAGE */}
              <img
                src={images[index % images.length]}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />

              {/* CONTENT */}
              <div style={{ padding: "15px" }}>
                <h3>{event.title}</h3>
                <p style={{ color: "#475569" }}>{event.description}</p>

                <p>📅 {event.date}</p>
                <p>📍 {event.location}</p>
                <p><b>👥 {count} / {event.max_participants || 50}</b></p>

                {/* USER */}
                {user && role !== "admin" ? (
                  status === "attended" ? (
                    <button style={btnBlue}>Attended ✅</button>
                  ) : status === "registered" ? (
                    <button style={btnRed} onClick={() => handleExit(event.id)}>
                      Exit ❌
                    </button>
                  ) : isFull ? (
                    <button style={btnGray}>Full 🚫</button>
                  ) : (
                    <button style={btnGreen} onClick={() => handleRegister(event.id)}>
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

                {/* ADMIN */}
                {role === "admin" && (
                  <>
                    <button style={btnYellow} onClick={() => handleEdit(event)}>
                      Edit ✏️
                    </button>
                    <button style={btnRed} onClick={() => handleDelete(event.id)}>
                      Delete 🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {editingEvent && (
        <div style={modal}>
          <div style={modalBox}>
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

            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingEvent(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// BUTTONS
const btnGreen = { width: "100%", background: "#10b981", color: "white", padding: "10px", borderRadius: "8px" };
const btnRed = { width: "100%", background: "#ef4444", color: "white", padding: "10px", borderRadius: "8px", marginTop: "5px" };
const btnBlue = { width: "100%", background: "#3b82f6", color: "white", padding: "10px", borderRadius: "8px" };
const btnGray = { width: "100%", background: "gray", color: "white", padding: "10px", borderRadius: "8px" };
const btnYellow = { width: "100%", background: "#f59e0b", color: "white", padding: "8px", borderRadius: "8px", marginTop: "5px" };

const modal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "320px",
};