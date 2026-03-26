import { useState } from "react";
import axios from "axios";

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !email || !eventId) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("eventId", eventId);

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/certificates/upload",
        formData
      );

      alert("✅ Certificate uploaded");
      setFile(null);
      setEmail("");
      setEventId("");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Certificate</h2>

      <input
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Event ID"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}