import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Principal.js";
import Prueba from "./prueba"; // <-- IMPORTANTE
import Login from "./Login.js"; 
import './App.css';
import Inicio from './Entrada.js'
import Admin from './Admin.js'
import { ToastProvider } from './toast';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/prueba" element={<Prueba />} />
        <Route path="/login" element={<Login />} />
  <Route path="/Inicio" element={<Inicio />} />
  <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </ToastProvider>
  );
}

export default App;
