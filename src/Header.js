import React from "react";
import { useNavigate } from "react-router-dom";
import "./animation.css"; 
import logo from "./Img/expressia.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src={logo} style={styles.logoImage} alt="Logo" onClick={() => navigate("/")} />
      </div>

      <button
        style={styles.loginBtn}
        onClick={() => navigate("/login")}
        onMouseEnter={(e) => {
          const leftArrow = e.currentTarget.querySelector(".left-arrow");
          const rightArrow = e.currentTarget.querySelector(".right-arrow");

          leftArrow.style.display = "inline-block";
          leftArrow.classList.remove("slide-right-out");
          leftArrow.classList.add("slide-right-in");

          rightArrow.classList.remove("slide-right-in");
          rightArrow.classList.add("slide-right-out");
        }}
        onMouseLeave={(e) => {
          const leftArrow = e.currentTarget.querySelector(".left-arrow");
          const rightArrow = e.currentTarget.querySelector(".right-arrow");

          leftArrow.classList.remove("slide-right-in");
          leftArrow.classList.add("slide-right-out");

          rightArrow.classList.remove("slide-right-out");
          rightArrow.classList.add("slide-right-in");
        }}
      >
        <span className="left-arrow" style={{ ...styles.sideArrow, display: "none", left: "100%" }}>{">"}</span>
        Iniciar Sesión
        <span className="right-arrow" style={styles.sideArrow}>{">"}</span>
      </button>
    </header>
  );
}

const styles = {
  header: {
  width: "100%", // <--- esto fuerza que ocupe todo el ancho
  background: "#0f172a",
  color: "#fff",
  padding: "16px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
},

  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoImage: {
    width: "190px",
    height: "75px",
    objectFit: "cover",
    cursor: "pointer",
  },
  loginBtn: {
    background: "#f97316", // naranja nuevo
    border: "none",
    padding: "10px 20px",
    borderRadius: 9999,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "SanaSans",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
  },
  sideArrow: {
    display: "inline-block",
    transition: "all 0.3s ease",
    width: "10px",
    opacity: 1,
  },
};
