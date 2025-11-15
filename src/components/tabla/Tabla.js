// src/components/tabla/Tabla.js
export default function Tabla({ children }) {
  return (
    <div style={{
      margin: 16,
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid #e0e0e0"
    }}>
      {children}
    </div>
  );
}
