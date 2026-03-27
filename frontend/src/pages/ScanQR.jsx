import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import supabase from "../services/supabase";

export default function ScanQR() {
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
        console.log("Scanned:", decodedText);

        try {
          // 🔥 Expected format: userId-eventId
          const [user_id, event_id] = decodedText.split("-");

          if (!user_id || !event_id) {
            alert("❌ Invalid QR Code");
            return;
          }

          // ✅ Insert or update (prevents duplicates)
          const { error } = await supabase
            .from("attendance")
            .upsert(
              {
                user_id,
                event_id,
              },
              {
                onConflict: "user_id,event_id",
              }
            );

          if (error) {
            console.error(error);
            alert("❌ Error marking attendance");
          } else {
            alert("✅ Attendance marked successfully!");
          }
        } catch (err) {
          console.error(err);
          alert("❌ Something went wrong");
        }
      },
      (error) => {
        // ignore scan errors
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📷 Scan QR for Attendance</h2>

      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}