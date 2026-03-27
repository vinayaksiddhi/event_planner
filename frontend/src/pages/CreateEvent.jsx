 import { useState } from "react";
import supabase from "../services/supabase";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = async () => {
    if (!title || !description || !date || !location) {
      alert("All fields required");
      return;
    }

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating event");
    } else {
      alert("✅ Event created");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>

      <input
        placeholder="Event Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}