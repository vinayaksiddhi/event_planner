import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Certificates() {
  const { user } = useContext(AuthContext);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/certificates/user/${user.email}`)
      .then((res) => setCerts(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div>
      <h2>My Certificates 🎓</h2>

      {certs.length === 0 ? (
        <p>No certificates yet</p>
      ) : (
        certs.map((c) => (
          <div key={c._id}>
            <p>Event: {c.eventId}</p>

            <a
              href={`http://localhost:5000/uploads/${c.file}`}
              download
            >
              Download Certificate
            </a>
          </div>
        ))
      )}
    </div>
  );
}