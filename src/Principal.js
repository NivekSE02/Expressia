import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // 👈 seguimos usando tu Header con flechitas
import { FaTruck, FaMapMarkerAlt, FaGlobe, FaUser } from "react-icons/fa"; // 👈 librería de íconos ligera

export default function Home() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="principal"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={styles.container}
        >
      <Header />

      {/* Hero */}
      <motion.section style={styles.hero}
        initial="hidden" animate="visible"
        variants={sectionVariants}>
        <motion.div style={styles.heroInner} variants={fadeStagger}>
          <motion.h2 style={styles.heroTitle} variants={fadeItem}>
            Envía y rastrea tus paquetes por toda
            <span style={styles.highlight}> Centroamérica</span>
          </motion.h2>
          <motion.p style={styles.heroSubtitle} variants={fadeItem}>
            Sistema integral de gestión logística para envíos rápidos, seguros y
            confiables en toda la región centroamericana.
          </motion.p>

          {/* Call to action box */}
          <motion.div style={styles.accessBox} variants={popCard} whileHover={{ scale: 1.02 }}>
            <div style={styles.accessIcon}>
              <FaUser size={28} color="#fff" />
            </div>
            <h3 style={styles.accessText}>Accede al Sistema</h3>
            <p style={styles.accessDesc}>
              Inicia sesión para gestionar tus envíos
            </p>
            <button style={styles.accessBtn} onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section style={styles.features} initial="hidden" animate="visible" variants={sectionVariants}>
        <motion.h3 style={styles.featuresTitle} variants={fadeItem}>¿Por qué elegir Expressia?</motion.h3>
        <motion.div style={styles.featuresGrid} variants={fadeStagger}>
          <Feature
            icon={<FaTruck size={28} color="#fff" />}
            bg="#f97316"
            title="Entregas Rápidas"
            desc="Red logística optimizada para entregas en 24-48 horas"
          />
          <Feature
            icon={<FaMapMarkerAlt size={28} color="#fff" />}
            bg="#0f172a"
            title="Seguimiento en Tiempo Real"
            desc="Rastrea tu paquete desde el origen hasta el destino"
          />
          <Feature
            icon={<FaGlobe size={28} color="#fff" />}
            bg="#f97316"
            title="Cobertura Regional"
            desc="Servicio en todos los países de Centroamérica"
          />
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer style={styles.footer} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
        <p>© 2025 Expressia. Conectando Centroamérica con confianza.</p>
      </motion.footer>
    </motion.div> )}
    </AnimatePresence>
  );
}

function Feature({ icon, title, desc, bg }) {
  return (
    <motion.div style={styles.featureCard} variants={popCard} whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <motion.div style={{ ...styles.featureIcon, background: bg }} variants={fadeItem}>{icon}</motion.div>
      <motion.h4 style={styles.featureTitle} variants={fadeItem}>{title}</motion.h4>
      <motion.p style={styles.featureDesc} variants={fadeItem}>{desc}</motion.p>
    </motion.div>
  );
}

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};
const fadeStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};
const fadeItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const popCard = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'anticipate' } }
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to bottom right, #f9fafb, #e8f0fb)",
    color: "#111",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  hero: {
    textAlign: "center",
    padding: "80px 20px",
  },
  heroInner: { maxWidth: 800, margin: "0 auto" },
  heroTitle: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1C1C1C",
  },
  highlight: { color: "#f97316" },
  heroSubtitle: {
    color: "#374151",
    fontSize: 18,
    lineHeight: 1.5,
    maxWidth: 600,
    margin: "0 auto 40px",
  },
  accessBox: {
    background: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    borderRadius: 12,
    padding: 32,
    maxWidth: 380,
    margin: "0 auto",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  accessIcon: {
    background: "#f97316",
    borderRadius: "50%",
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  accessText: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  accessDesc: { fontSize: 15, color: "#6b7280", marginBottom: 20 },
  accessBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    transition: "background 0.3s ease",
  },
  features: { background: "#fff", padding: "80px 20px", textAlign: "center" },
  featuresTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1C1C1C",
  },
  featuresGrid: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
    flexWrap: "wrap",
  },
  featureCard: {
    maxWidth: 280,
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    background: "#fafafa",
  },
  featureIcon: {
    borderRadius: "50%",
    width: 64,
    height: 64,
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  featureDesc: { fontSize: 15, color: "#374151" },
  footer: {
    marginTop: "auto",
    background: "#1C1C1C",
    color: "#fff",
    textAlign: "center",
    padding: 24,
    fontSize: 14,
  },
};
