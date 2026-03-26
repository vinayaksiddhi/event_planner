import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import supabase from "../services/supabase";

export default function ScanQR() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Scanned:", decodedText);

        const [userId, eventId] = decodedText.split("-");

        await supabase.from("attendance").upsert(
          {
            user_id: userId,
            event_id: eventId,
          },
          { onConflict: ["user_id", "event_id"] }
        );

        alert("Attendance marked ✅");
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Scan QR</h2>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}