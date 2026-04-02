import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabase";

export default function Certificates() {
  const { user } = useContext(AuthContext);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("email", user.email);

    if (error) console.error(error);
    else setCerts(data);
  };

  return (
    <div style={page}>
      <h2 style={title}>🎓 My Certificates</h2>

      {certs.length === 0 ? (
        <p style={empty}>No certificates yet</p>
      ) : (
        <div style={grid}>
          {certs.map((c) => (
            <div key={c.id} style={card}>
              <h3 style={eventTitle}>{c.event_id}</h3>

              <p style={desc}>Certificate Available</p>

              <a
                href={c.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={btn}
              >
                View ⬇️
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🔥 STYLES */

const page = {
  minHeight: "calc(100vh - 70px)",
  padding: "30px",
  background: "linear-gradient(to right, #f0f9ff, #e0f2fe)",
};

const title = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "28px",
  color: "#2563eb",
};

const empty = {
  textAlign: "center",
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "20px",
};

const card = {
  width: "260px",
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const eventTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const desc = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "15px",
};

const btn = {
  display: "inline-block",
  padding: "10px 15px",
  borderRadius: "10px",
  background: "linear-gradient(to right, #22c55e, #4ade80)",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};