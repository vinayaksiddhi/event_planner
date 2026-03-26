import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <h2>Loading...</h2>;

  if (!user) return <Navigate to="/login" />;

  if (role !== "admin") {
    return <h2>Not Authorized 🚫</h2>;
  }

  return children;
}