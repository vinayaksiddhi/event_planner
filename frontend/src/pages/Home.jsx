import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 300], [1, 0.85]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const bgY = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <PageWrapper>
      {/* 🌌 Animated Background */}
      <AnimatedBackground />

      <motion.div style={{ ...page, y: bgY }}>
        
        {/* ================= HERO ================= */}
        <motion.section
          style={{
            ...hero,
            scale,
            opacity,
            y,
          }}
        >
          <motion.h1
            style={title}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Event Planner 🚀
          </motion.h1>

          <motion.p
            style={subtitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Discover • Manage • Experience Events Like Never Before
          </motion.p>

          <motion.button
            style={btn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            Get Started →
          </motion.button>
        </motion.section>

        {/* ================= TEXT ================= */}
        <motion.h2
          style={headline}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Built for Modern Events ⚡
        </motion.h2>

        {/* ================= FEATURES ================= */}
        <section style={featuresSection}>
          <motion.div style={grid}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                style={card}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.08 }}
                viewport={{ once: true }}
              >
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ================= FOOTER ================= */}
        <div style={footer}>
          © 2026 Event Planner • Built with ❤️
        </div>
      </motion.div>
    </PageWrapper>
  );
}

/* ================= BACKGROUND ================= */

const AnimatedBackground = () => (
  <div style={bgWrapper}>
    <motion.div
      style={circle1}
      animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
      transition={{ duration: 18, repeat: Infinity }}
    />
    <motion.div
      style={circle2}
      animate={{ x: [0, -120, 120, 0], y: [0, 80, -80, 0] }}
      transition={{ duration: 20, repeat: Infinity }}
    />
  </div>
);

/* ================= DATA ================= */

const features = [
  { title: "📅 Create Events", desc: "Organize and manage events easily" },
  { title: "🎫 QR Attendance", desc: "Smart attendance tracking system" },
  { title: "📸 Event Gallery", desc: "Store and view event memories" },
  { title: "🏆 Certificates", desc: "Instant certificate generation" },
];

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  color: "white",
  fontFamily: "Segoe UI",
};

/* HERO */
const hero = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "20px",
};

const title = {
  fontSize: "64px",
  fontWeight: "bold",
  textShadow: "0 0 30px rgba(99,102,241,0.6)",
};

const subtitle = {
  marginTop: "15px",
  fontSize: "18px",
  opacity: 0.85,
};

const btn = {
  marginTop: "30px",
  padding: "14px 30px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(to right, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
};

/* TEXT */
const headline = {
  fontSize: "40px",
  textAlign: "center",
  marginTop: "100px",
};

/* FEATURES */
const featuresSection = {
  padding: "100px 20px",
};

const grid = {
  display: "flex",
  gap: "25px",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: "50px",
};

const card = {
  width: "240px",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
};

/* FOOTER */
const footer = {
  textAlign: "center",
  padding: "30px",
  opacity: 0.6,
};

/* BACKGROUND */
const bgWrapper = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
  background: "linear-gradient(135deg, #020617, #1e3a8a)",
};

const circle1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "rgba(99,102,241,0.4)",
  filter: "blur(120px)",
  top: "20%",
  left: "10%",
};

const circle2 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "rgba(139,92,246,0.4)",
  filter: "blur(120px)",
  bottom: "10%",
  right: "10%",
};