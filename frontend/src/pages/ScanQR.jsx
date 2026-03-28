import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import supabase from "../services/supabase";

export default function ScanQR() {
  const scannerRef = useRef(null); // ✅ prevent duplicate scanner
  const isScannedRef = useRef(false); // ✅ prevent multiple scans

  useEffect(() => {
    // 🚫 Prevent double initialization (React Strict Mode fix)
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
        // 🚫 stop repeated scans
        if (isScannedRef.current) return;
        isScannedRef.current = true;

        console.log("Scanned:", decodedText);

        try {
          // 🔥 CLEAN INPUT
          const cleanText = decodedText.trim();
          const parts = cleanText.split("-");

          if (parts.length !== 2) {
            alert("❌ Invalid QR Format");
            isScannedRef.current = false;
            return;
          }

          const [user_id, event_id] = parts;

          if (!user_id || !event_id) {
            alert("❌ Invalid QR Data");
            isScannedRef.current = false;
            return;
          }

          // ✅ UPSERT (safe insert)
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
            isScannedRef.current = false;
          } else {
            alert("✅ Attendance marked!");

            // ✅ STOP SCANNER AFTER SUCCESS
            scanner.clear().catch(() => {});
          }
        } catch (err) {
          console.error(err);
          alert("❌ Something went wrong");
          isScannedRef.current = false;
        }
      },
      () => {
        // ignore scan errors
      }
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