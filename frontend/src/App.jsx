import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Events page */}
        <Route path="/events" element={<Events />} />

        {/* Create event (protected) */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        {/* Dashboard (home) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <h1>Dashboard</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;