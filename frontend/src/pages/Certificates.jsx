import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Certificates() {
  const { user } = useContext(AuthContext);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/certificates/user/${user.email}`)
      .then((res) => setCerts(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div style={page}>
      <h2 style={title}>🎓 My Certificates</h2>

      {certs.length === 0 ? (
        <p style={empty}>No certificates yet</p>
      ) : (
        <div style={grid}>
          {certs.map((c) => (
            <div key={c._id} style={card}>
              {/* 🔥 SHOW EVENT ID OR NAME */}
              <h3 style={eventTitle}>{c.eventId}</h3>

              <p style={desc}>Certificate Available</p>

              {/* ✅ FIXED LINK */}
              <a
                href={c.file}
                target="_blank"
                rel="noopener noreferrer"
                style={btn}
              >
                View / Download ⬇️
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