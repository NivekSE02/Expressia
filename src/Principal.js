import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { loadOrders } from './storage';
import { FaTruck, FaMapMarkerAlt, FaGlobe, FaBolt, FaClock, FaShieldAlt } from 'react-icons/fa';


const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.05 } })
};
const scaleIn = {
  hidden:{ opacity:0, scale:.9, y:16 },
  visible:{ opacity:1, scale:1, y:0, transition:{ duration:.55, ease:'anticipate' } }
};

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div variants={scaleIn} className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4 group">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-inner bg-gradient-to-br ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-800 tabular-nums">
          <CountUp value={value} />
        </p>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <motion.div variants={scaleIn} whileHover={{ y:-6 }} className="relative flex flex-col rounded-2xl p-6 bg-white/80 backdrop-blur shadow-sm border border-slate-200 overflow-hidden">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-md bg-gradient-to-br ${gradient}`}>{icon}</div>
      <h4 className="font-semibold text-slate-800 text-lg mb-2 leading-snug">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">{desc}</p>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-sky-200/30 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}

function Step({ number, title, desc }) {
  return (
    <motion.div variants={fade} className="relative pl-10">
      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#F77F00] to-[#0D1B2A] text-white flex items-center justify-center text-sm font-semibold shadow" >{number}</div>
      <h5 className="font-semibold text-slate-800 mb-1">{title}</h5>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function CountUp({ value, duration=900 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0; const startTs = performance.now();
    const step = (ts) => {
      const p = Math.min(1, (ts - startTs)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.round(start + (value - start) * eased);
      setDisplay(val);
      if (p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span>{display}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total:0, entregado:0, transito:0, pendiente:0 });
  const [mounted, setMounted] = useState(false);
  // Eliminado currentUser: la única vía es iniciar sesión

  useEffect(() => {
    setMounted(true);
    const orders = loadOrders();
    const total = orders.length;
    const entregado = orders.filter(o=>o.status==='entregado').length;
    const transito = orders.filter(o=>o.status==='en-transito').length;
    const pendiente = orders.filter(o=>o.status==='pendiente').length;
    setStats({ total, entregado, transito, pendiente });
  }, []);

  const goLogin = () => navigate('/login');

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-sky-50 relative font-sans selection:bg-orange-200/60 selection:text-slate-900">
  {/* Fondo decorativo suavizado y reducido para no interferir con el header */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_38%,rgba(255,179,71,0.12),transparent_38%),radial-gradient(circle_at_78%_55%,rgba(56,189,248,0.15),transparent_42%)] pointer-events-none" />
      <Header />
      {/* HERO */}
      <motion.section
        initial="hidden" animate="visible"
        variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.08 }}}}
        className="relative w-full px-6 pt-20 pb-24 md:pt-28 md:pb-28 max-w-6xl mx-auto"
      >
        <motion.h1 variants={fade} className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 leading-tight mb-6">
          Envía y rastrea tus paquetes en <span className="bg-gradient-to-r from-[#F77F00] via-[#f59e0b] to-[#0D1B2A] bg-clip-text text-transparent">Centroamérica</span>
        </motion.h1>
        <motion.p variants={fade} className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-8">
          Plataforma moderna para logística regional: creación de envíos, tracking detallado, auditoría y exportación de datos en un solo lugar.
        </motion.p>
        <motion.div variants={fade} className="flex mb-14 max-w-xs">
          <button onClick={goLogin} className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold bg-[#0D1B2A] text-white shadow hover:shadow-lg hover:bg-[#14324c] transition text-sm md:text-base">
            Iniciar Sesión
          </button>
        </motion.div>
        {/* Stats */}
        <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Pedidos" value={stats.total} icon={<FaTruck className="h-5 w-5" />} color="from-orange-500 to-orange-600" />
          <StatCard label="En tránsito" value={stats.transito} icon={<FaMapMarkerAlt className="h-5 w-5" />} color="from-sky-500 to-sky-600" />
            <StatCard label="Entregados" value={stats.entregado} icon={<FaGlobe className="h-5 w-5" />} color="from-emerald-500 to-emerald-600" />
          <StatCard label="Pendientes" value={stats.pendiente} icon={<FaClock className="h-5 w-5" />} color="from-amber-500 to-amber-600" />
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <section className="relative bg-white/70 backdrop-blur border-y border-slate-200 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }} variants={fade} className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 text-center">¿Por qué elegir <span className="text-[#F77F00]">Expressia</span>?</motion.h3>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }} variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.1 }}}} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<FaTruck className="h-6 w-6" />} title="Entregas Rápidas" desc="Optimización de rutas y priorización inteligente para ventanas de 24-48h." gradient="from-orange-500 to-orange-600" />
            <FeatureCard icon={<FaMapMarkerAlt className="h-6 w-6" />} title="Tracking Detallado" desc="Línea de tiempo editable con hitos y estado derivado automáticamente." gradient="from-sky-500 to-sky-600" />
            <FeatureCard icon={<FaShieldAlt className="h-6 w-6" />} title="Seguridad y Confiabilidad" desc="Integridad de datos, protección de la información y alta disponibilidad." gradient="from-emerald-500 to-emerald-600" />
            <FeatureCard icon={<FaBolt className="h-6 w-6" />} title="Experiencia Moderna" desc="UI responsiva, notificaciones avanzadas y rendimiento ligero." gradient="from-fuchsia-500 to-fuchsia-600" />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fade} className="text-2xl md:text-3xl font-bold text-slate-800 mb-12 text-center">Cómo funciona</motion.h3>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }} variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.12 }}}} className="grid md:grid-cols-3 gap-10 relative">
            <Step number={1} title="Crea tu envío" desc="Completa origen, destino, peso y modalidad. Obten el costo estimado al instante." />
            <Step number={2} title="Seguimiento inteligente" desc="Visualiza y el administrador puede ajustar hitos del tracking validando cronología." />
            <Step number={3} title="Confiabilidad y seguridad" desc="Alta disponibilidad, integridad de datos y protección de la información." />
            <div className="absolute top-8 left-0 right-0 hidden md:block h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center rounded-3xl px-8 py-16 shadow-xl overflow-hidden bg-white/80 backdrop-blur border border-slate-200">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_30%,rgba(247,127,0,0.15),transparent_60%)] pointer-events-none" />
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 leading-tight">Impulsa tu logística hoy</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">Unifica creación, seguimiento y auditoría sin complejidad. Escalable, rápido y centrado en la experiencia del usuario. ¡Empieza ahora!</p>
          <div className="flex justify-center">
            <button onClick={goLogin} className="inline-flex justify-center items-center gap-2 bg-[#F77F00] hover:bg-[#f76700] text-white font-semibold rounded-xl px-8 py-3 text-sm md:text-base shadow-lg shadow-orange-500/25 transition">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </section>

      <footer className="mt-auto bg-[#0D1B2A] text-slate-200 text-center py-6 text-xs tracking-wide">
        © 2025 Expressia. Conectando Centroamérica con confianza.
      </footer>
    </div>
  );
}
