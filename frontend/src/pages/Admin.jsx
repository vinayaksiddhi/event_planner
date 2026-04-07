import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

function Admin() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/certificates")
      .then(res => setCerts(res.data));
  }, []);

  return (
    <PageWrapper>
      <div style={page}>
        
        {/* 🔥 Header */}
        <motion.h2
          style={title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard ⚙️
        </motion.h2>

        {/* 🔥 Table Container */}
        <motion.div
          style={tableWrapper}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Download</th>
              </tr>
            </thead>

            <tbody>
              {certs.map((c, i) => (
                <motion.tr
                  key={c._id}
                  style={row}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    <a
                      href={`http://localhost:5000/uploads/${c.file}`}
                      download
                      style={downloadBtn}
                    >
                      Download
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default Admin;

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "100px 20px",
  background: "linear-gradient(135deg, #020617, #1e3a8a)",
  color: "white",
};

const title = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "32px",
};

const tableWrapper = {
  maxWidth: "900px",
  margin: "auto",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const row = {
  textAlign: "center",
};

const downloadBtn = {
  padding: "6px 14px",
  borderRadius: "999px",
  background: "linear-gradient(to right, #6366f1, #8b5cf6)",
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
};