import { useState } from "react";
import axios from "axios";

function Download() {
  const [email, setEmail] = useState("");
  const [certs, setCerts] = useState([]);

  const fetchCert = async () => {
    const res = await axios.get("http://localhost:5000/api/certificates");
    const filtered = res.data.filter(c => c.email === email);
    setCerts(filtered);
  };

  return (
    <div>
      <h2>Download Certificate</h2>
      <input placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={fetchCert}>Search</button>

      {certs.map(c => (
        <div key={c._id}>
          <p>{c.name}</p>
          <a href={`http://localhost:5000/uploads/${c.file}`} download>
            Download
          </a>
        </div>
      ))}
    </div>
  );
}

export default Download;