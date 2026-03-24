import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) console.log(error);
    else setEvents(data);
  };

  return (
    <div>
      <h1>Events</h1>

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.date}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}