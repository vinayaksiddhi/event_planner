import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import supabase from "../services/supabase";

export default function ScanQR() {
  const scannerRef = useRef(null);
  const isScannedRef = useRef(false);

  useEffect(() => {
  const scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    false
  );

  scanner.render(
    async (decodedText) => {
      if (isScannedRef.current) return;
      isScannedRef.current = true;

      try {
        const cleanText = decodedText.trim();
        const parts = cleanText.split("|");

        if (parts.length !== 3) {
          alert("❌ Invalid QR Format");
          isScannedRef.current = false;
          return;
        }

        const [event_name, event_id, user_id] = parts;

        const { error } = await supabase
          .from("attendance")
          .upsert(
            {
              user_id,
              event_id,
              attended: true,
            },
            {
              onConflict: "user_id,event_id",
            }
          );

        if (error) {
          alert("❌ Error marking attendance");
          isScannedRef.current = false;
        } else {
          alert(`✅ Attendance marked for ${event_name}`);
          scanner.clear().catch(() => {});
        }
      } catch (err) {
        console.error(err);
        alert("❌ Something went wrong");
        isScannedRef.current = false;
      }
    },
    () => {}
  );

  return () => {
    scanner.clear().catch(() => {});
  };
}, []);

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>📷 Scan QR</h2>
        <p style={subtitle}>Scan participant QR to mark attendance</p>

        <div id="reader" style={scannerBox}></div>
      </div>
    </div>
  );
}

/* 🔥 ONLY UI STYLES */

const page = {
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #e0f2fe, #f8fafc)",
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "center",
};

const title = {
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "15px",
};

const scannerBox = {
  width: "260px",
  margin: "auto",
};