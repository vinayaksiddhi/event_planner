import { useState } from "react";
import supabase from "../services/supabase";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name || !description) {
      alert("All fields required");
      return;
    }

    const { error } = await supabase.from("events").insert([
      {
        name,
        description,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating event");
    } else {
      alert("✅ Event created");
      setName("");
      setDescription("");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>

      <input
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Date"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Location"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}