import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import supabase from "../services/supabase";

export default function ScanQR() {
  const scannerRef = useRef(null);
  const isScannedRef = useRef(false);

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (isScannedRef.current) return;
        isScannedRef.current = true;

        console.log("Scanned:", decodedText);

        try {
          const cleanText = decodedText.trim();

          // 🔥 NEW FORMAT: eventName|eventId|userId
          const parts = cleanText.split("|");

          if (parts.length !== 3) {
            alert("❌ Invalid QR Format");
            isScannedRef.current = false;
            return;
          }

          const [event_name, event_id, user_id] = parts;

          if (!event_id || !user_id) {
            alert("❌ Invalid QR Data");
            isScannedRef.current = false;
            return;
          }

          console.log("Event:", event_name);
          console.log("Event ID:", event_id);
          console.log("User ID:", user_id);

          const { error } = await supabase
            .from("attendance")
            .upsert(
              {
                user_id,
                event_id,
                attended: true
              },
              {
                onConflict: "user_id,event_id",
              }
            );

          if (error) {
            console.error(error);
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
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📷 Scan QR for Attendance</h2>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}