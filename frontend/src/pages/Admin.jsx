import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/certificates")
      .then(res => setCerts(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {certs.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <a href={`http://localhost:5000/uploads/${c.file}`} download>
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;