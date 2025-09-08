import React from "react";
import Header from "./Header";
import parcelIcon from "./Img/wondicon-ui-free-parcel_111208.png";
import HistorialIcon from "./Img/folder.png";
import CalendarioIcon from "./Img/calendario.png";
import CentroICon from "./Img/centro.png";
import CamionIcon from "./Img/Camion.png";
import CandadoIcon from "./Img/Candado.png";
import Rayoicon from "./Img/rayo.png";
import MaletIcon from "./Img/maletin.png";
import EstadIcon from "./Img/Grafica.png";
import './animation.css';



const securityItems = [
  {  icon: parcelIcon, 
  isImage: true, 
  title: "Envía tus paquetes", 
  desc: "Envía cualquier paquete de manera rápida y segura a toda Centroamérica." },
  { icon: HistorialIcon, isImage: true, title: "Historial completo", desc: "Consulta fácilmente el estado de todos tus envíos en un solo lugar." },
  { icon: CalendarioIcon, isImage: true, title: "Programa tus envíos", desc: "Agenda tus entregas para que lleguen cuando lo necesites." },
  { icon: CamionIcon, isImage: true, title: "Seguimiento en tiempo real", desc: "Sigue tus pedidos en cada paso hasta que lleguen a su destino." },
  { icon: CandadoIcon, isImage: true, title: "Seguridad garantizada", desc: "Tus paquetes están protegidos con los más altos estándares de seguridad." },
  { icon: Rayoicon, isImage: true, title: "Rápido y confiable", desc: "Procesos automatizados para que tu envío llegue sin retrasos." },
  { icon: CentroICon, isImage: true, title: "Cobertura regional", desc: "Envíos a toda Centroamérica con la misma facilidad y rapidez." },
  { icon: MaletIcon, isImage: true, title: "Para empresas y emprendedores", desc: "Optimiza la logística de tu negocio con nuestra plataforma." },
  { icon: EstadIcon, isImage: true, title: "Reportes claros", desc: "Visualiza estadísticas y métricas de tus envíos para tomar mejores decisiones." },
];


export default function Home() {
  const rows = [];
  const itemsPerRow = 3;

  // Dividir los items en filas de 3
  for (let i = 0; i < securityItems.length; i += itemsPerRow) {
    rows.push(securityItems.slice(i, i + itemsPerRow));
  }

  return (
    <div style={{ fontFamily: 'SanaSans-Variable', background: '#000', minHeight: '100vh', color: '#dfd5d5ff' }}>
  <Header />

  {/* Sección del título y párrafo */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '100px', // para que no quede pegado al header fijo
    marginLeft: '50px',
    marginRight: '50px',
  }}>
    <h1 className="tracking-in-expand" style={{ 
  color: '#dddfe1ff',
  fontWeight: 700,
  fontSize: '5rem',
  paddingLeft: '50px',
}}>
  Expressia
</h1>
    <p style={{
      color: '#aaa',
      fontSize: '1.1rem',
      maxWidth: '500px',
      margin: 0,
      paddingRight: '180px',
    }}>
      Envía y recibe paquetes de forma rápida, segura y confiable en toda Centroamérica. Optimiza tus envíos, haz seguimiento en tiempo real y simplifica la logística de tu negocio.
    </p>
  </div>

  {/* Contenido principal */}
  <main style={{ maxWidth: 1200, margin: '40px auto', padding: '32px' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: rowIndex < rows.length - 1 ? '1px solid #2e2d2dff' : 'none',
            padding: '1rem 0',
          }}
        >
          {row.map((item, index) => (
  <div key={index} style={{ flex: 1, textAlign: 'center' }}>
  <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>
  {item.isImage ? (
    <img src={item.icon} alt={item.title} style={{ width: 48, height: 48 }} />
  ) : (
    item.icon
  )}


</div>

    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#e5e5e5ff' }}>{item.title}</h3>
    <p style={{ fontSize: '0.95rem', lineHeight: 1.4, color: '#aaa' }}>{item.desc}</p>
  </div>
))}
        </div>
      ))}
    </div>
  </main>
</div>

  );
  
}
