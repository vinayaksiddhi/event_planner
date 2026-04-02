import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/certificates")
      .then((res) => setCerts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/certificates/${id}`
      );
      alert("Deleted");
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>All Certificates</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Event</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {certs.map((c) => (
            <tr key={c._id}>
              <td>{c.email}</td>
              <td>{c.eventId}</td>
              <td>
                <a
                 href={cert.file}
                  download
                >
                  Download
                </a>
              </td>
              <td>
                <button onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}