import { useState, useContext } from "react";
import supabase from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = async () => {
    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
        created_by: user.id
      }
    ]);

    if (error) alert(error.message);
    else alert("Event created!");
  };

  return (
    <div>
      <h1>Create Event</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Date" onChange={(e) => setDate(e.target.value)} />
      <input placeholder="Location" onChange={(e) => setLocation(e.target.value)} />

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}