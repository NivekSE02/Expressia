import React from "react";
import logo from "./Img/expressia.png";

export default function Header() {
  return (
    <header style={styles.header}>
  
      <img src={logo} style={styles.logoImage} alt="Logo" />
      <button style={styles.button}>Iniciar sesión</button>
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
    display: "flex",
    justifyContent: "space-between",
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
  
  button: {
    height  : 40,
    width: 120,
    backgroundColor: "#d7204eff",
    color: "Black",
    border: "none",
    fontFamily: "SanaSans",
    borderRadius: "2px",
    cursor: "pointer",
    fontWeight: 600,         
    fontSize: 16,  
    borderRadius: 9999999,
  },
};
