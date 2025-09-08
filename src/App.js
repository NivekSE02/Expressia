import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Principal";
import Prueba from "./prueba"; // <-- IMPORTANTE
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prueba" element={<Prueba />} />
      </Routes>
    </Router>
  );
}

export default App;
