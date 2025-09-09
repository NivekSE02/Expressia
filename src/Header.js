import React from "react";
import "./animation.css"; 
import logo from "./Img/expressia.png";

export default function Header() {

  // Redirige a una ruta usando window.location o history.push si usas react-router
function handleRedirect(path) {
  const content = document.getElementById("page-content");
  if (content) {
    content.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = path;
    }, 1200); // mismo tiempo que la animación
  } else {
    window.location.href = path; // fallback
  }
}

  return (
    <header style={styles.header}>
      <link rel="preload" href="./fonts/SanaSans-Variable.woff2" as="font" type="font/woff2" crossorigin />

      <div style={styles.centerMenu}>
      
        <button
          style={styles.butto}
          onMouseEnter={(e) => {
            const arrow = e.currentTarget.firstChild;
            arrow.classList.remove("slide-right-out");
            arrow.classList.add("slide-right-in");
          }}
          onMouseLeave={(e) => {
            const arrow = e.currentTarget.firstChild;
            arrow.classList.remove("slide-right-in");
            arrow.classList.add("slide-right-out");
          }}
        >
          <span style={styles.arrow}>{">"}</span>Contacto
        </button>

        <img src={logo} style={styles.logoImage} alt="Logo" onClick={() => handleRedirect("/")} />

     
        <button
          style={styles.butto}
          onMouseEnter={(e) => {
            const arrow = e.currentTarget.firstChild;
            arrow.classList.remove("slide-right-out");
            arrow.classList.add("slide-right-in");
          }}
          onMouseLeave={(e) => {
            const arrow = e.currentTarget.firstChild;
            arrow.classList.remove("slide-right-in");
            arrow.classList.add("slide-right-out");
            }}
          >
            <span style={styles.arrow}>{">"}</span>Nosotros
          </button>
          </div>

          <button
          style={styles.button}
          onClick={() => {
            const url = "/login";
            const content = document.getElementById("page-content");
            if (content) {
            content.classList.add("fade-out");
            setTimeout(() => {
              window.location.href = url;
            }, 1200); // duración igual a la animación
            } else {
            window.location.href = url; // fallback
            }
          }}
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
        Iniciar sesión
        <span className="right-arrow" style={styles.sideArrow}>{">"}</span>
      </button>
    </header>
  );
}

const styles = {
  sideArrow: {
    display: "inline-block",
    transition: "all 0.3s ease",
    width: "10px",
    opacity: 1,
  },

  logoImage: {
  width: "190px",
  height: "75px",
  objectFit: "cover",
  cursor: "pointer",
},
  header: {
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    padding: "10px 50px",
    backgroundColor: "#000",
    color: "white",
    borderBottom: "0.5px solid #2e2d2d",
    width: "100%",
    zIndex: 1000,
    position: "fixed",
    top: 0,
    boxSizing: "border-box",
  },

  butto: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontFamily: "SanaSans",
    fontWeight: 600,
    fontSize: 16,
    borderRadius: 0,
    padding: 15,
    gap: "15px",
  },
  arrow: {
    display: "inline-block",
    opacity: 0,
    transition: "all 0.3s ease",
    width: "10px",
  },

  button: {
    height: 40,
    width: 160,
    backgroundColor: "#d7204eff",
    color: "Black",
    border: "none",
    fontFamily: "SanaSans",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    borderRadius: 9999999,
  },
  centerMenu: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    margin: "0 auto",
  },
};
