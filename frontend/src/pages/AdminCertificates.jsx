import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*");

    if (error) console.error(error);
    else setCerts(data);
  };

  const handleDelete = async (id) => {
    await supabase.from("certificates").delete().eq("id", id);
    fetchData();
  };

  return (
    <div style={page}>
      <h2 style={title}>📜 All Certificates</h2>

      {certs.length === 0 ? (
        <p>No certificates found</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Event</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {certs.map((c) => (
              <tr key={c.id}>
                <td>{c.email}</td>
                <td>{c.event_id}</td>

                <td>
                  <a
                    href={c.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={viewBtn}
                  >
                    View
                  </a>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* 🔥 STYLES */

const page = {
  padding: "30px",
  background: "linear-gradient(to right, #f1f5f9, #e0f2fe)",
  minHeight: "calc(100vh - 70px)",
};

const title = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#3b82f6"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "10px",
  overflow: "hidden",
};

const viewBtn = {
  padding: "6px 10px",
  background: "#3b82f6",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};