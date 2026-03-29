import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        id,
        users (name, college),
        events (title),
        attended
      `);

    if (error) {
      console.error(error);
      return;
    }

    setAttendance(data || []);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Dashboard 📋</h2>

      {attendance.length === 0 ? (
        <p>No attendance records</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>College</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.users?.name || "N/A"}</td>
                <td>{a.users?.college || "N/A"}</td>
                <td>{a.events?.title || "N/A"}</td>
                <td>
                  {a.attended !== false ? "✅ Present" : "❌ Absent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}