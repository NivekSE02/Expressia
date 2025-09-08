import React from "react";
import logo from "./Img/expressia.png";

export default function Header() {
  return (
    <header style={styles.header}>
  
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

    <img src={logo} style={styles.logoImage} alt="Logo" />


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
  onMouseEnter={(e) => {
    const leftArrow = e.currentTarget.querySelector(".left-arrow");
    const rightArrow = e.currentTarget.querySelector(".right-arrow");

    // Mostrar > izquierdo
    leftArrow.style.display = "inline-block";
    leftArrow.classList.remove("slide-right-out");
    leftArrow.classList.add("slide-right-in");

    // Ocultar > derecho
    rightArrow.classList.remove("slide-right-in");
    rightArrow.classList.add("slide-right-out");
  }}
  onMouseLeave={(e) => {
    const leftArrow = e.currentTarget.querySelector(".left-arrow");
    const rightArrow = e.currentTarget.querySelector(".right-arrow");

    // Ocultar > izquierdo
    leftArrow.classList.remove("slide-right-in");
    leftArrow.classList.add("slide-right-out");

    // Mostrar > derecho
    rightArrow.classList.remove("slide-right-out");
    rightArrow.classList.add("slide-right-in");
  }}
>
  <span className="left-arrow" style={styles.sideArrow}>{">"}</span>
  Iniciar sesión  
  <span className="right-arrow" style={styles.sideArrow}>{">"}</span>
</button>

  
</header>

  );
}

const styles = {

  logoImage: {
    width: 190,
    height: 75,
    objectFit: "cover",

  },
  header: {
    justifyContent: "space-between", 
    display: "flex",
    alignItems: "center",
    padding: "10px 50px",
    backgroundColor: "#000000ff",
    color: "white",
    borderBottom: "0.5px solid #2e2d2dff",
    width: "100%",      // <- ocupa todo el ancho de la pantalla
    zIndex: 1000,    
    position: "fixed",  // <- esto lo hace fijo
    top: 0,   
    boxSizing: "border-box", // <- para que quede encima del resto del contenido
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
    padding: 15, // opcional, para que no se note espacio extra
    gap: "15px", // espacio entre ">" y texto
  },
  arrow: {
  display: "inline-block", // necesario para transform
  opacity: 0,              // inicialmente invisible
  transition: "all 0.3s ease",
  width: "10px",           // evita que empuje texto al aparecer
},
  button: {
    height  : 40,
    width: 140,
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
  margin: "0 auto", // centra todo el contenido del medio
}
};
