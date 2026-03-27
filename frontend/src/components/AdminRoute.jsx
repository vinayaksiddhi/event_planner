import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/events" />; // redirect normal users
  }

  return children;
}