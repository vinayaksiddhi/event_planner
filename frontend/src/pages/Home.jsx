import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  // 🔥 Cursor Glow Effect
  useEffect(() => {
    const move = (e) => {
      const glow = document.getElementById("cursorGlow");
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={page}>
      {/* CURSOR GLOW */}
      <div id="cursorGlow" style={cursorGlow}></div>

      {/* PARTICLES */}
      <div style={particles}>
        {[...Array(30)].map((_, i) => (
          <span key={i} style={particle()}></span>
        ))}
      </div>

      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>
          Welcome to <span style={highlight}>Event Planner</span>
        </h1>

        <p style={subtitle}>
          Discover • Manage • Experience Events Like Never Before 🚀
        </p>

        <div style={btnContainer}>
          <button
            style={primaryBtn}
            onClick={() => navigate("/events")}
          >
            Explore Events
          </button>

          <button
            style={secondaryBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div style={features}>
        <h2 style={sectionTitle}>✨ Features</h2>

        <div style={featureGrid}>
          <Feature title="📅 Create Events" desc="Manage easily" />
          <Feature title="📸 Gallery" desc="View memories" />
          <Feature title="🎫 QR Attendance" desc="Smart tracking" />
          <Feature title="🏆 Certificates" desc="Instant download" />
        </div>
      </div>

      {/* IMAGES */}
      <div style={imageSection}>
        <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b" style={image} />
        <img src="https://images.unsplash.com/photo-1511578314322-379afb476865" style={image} />
      </div>

      {/* FOOTER */}
      <div style={footer}>
        © 2026 Event Planner • Built for innovation 🚀
      </div>
    </div>
  );
}

/* ===== FEATURE COMPONENT ===== */

function Feature({ title, desc }) {
  return (
    <div
      style={featureCard}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y / rect.height - 0.5) * 10;
        const rotateY = (x / rect.width - 0.5) * -10;

        e.currentTarget.style.transform =
          `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
      }}
    >
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

/* ===== STYLES ===== */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #1e3a8a)",
  color: "white",
  position: "relative",
  overflow: "hidden",
  fontFamily: "Segoe UI",
};

/* CURSOR GLOW */
const cursorGlow = {
  position: "fixed",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent)",
  borderRadius: "50%",
  pointerEvents: "none",
  transform: "translate(-50%, -50%)",
};

/* PARTICLES */
const particles = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

const particle = () => ({
  position: "absolute",
  width: "5px",
  height: "5px",
  background: "white",
  borderRadius: "50%",
  opacity: 0.2,
  top: Math.random() * 100 + "%",
  left: Math.random() * 100 + "%",
  animation: "float 10s linear infinite",
});

/* HERO */
const hero = {
  textAlign: "center",
  padding: "120px 20px",
  animation: "floatHero 6s ease-in-out infinite",
};

const title = { fontSize: "52px" };

const highlight = {
  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

const subtitle = { opacity: 0.8 };

const btnContainer = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const primaryBtn = {
  padding: "12px 20px",
  borderRadius: "12px",
  background: "#6366f1",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 20px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "white",
  border: "none",
};

/* FEATURES */
const features = { padding: "40px", textAlign: "center" };

const sectionTitle = { fontSize: "28px" };

const featureGrid = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const featureCard = {
  width: "220px",
  padding: "20px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(25px)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  transition: "0.3s",
};

/* IMAGES */
const imageSection = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  padding: "40px",
};

const image = {
  width: "300px",
  borderRadius: "15px",
};

/* FOOTER */
const footer = {
  textAlign: "center",
  padding: "30px",
  opacity: 0.6,
};