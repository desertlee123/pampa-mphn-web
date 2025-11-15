// src/components/tabla/Fila.js
export default function Fila({ titulo, valor, theme }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: theme.cardBackground || "#fff",
    }}>
      <div style={{
        flex: 1,
        padding: 12,
        fontWeight: "bold",
        color: theme.text.primary,
        borderRight: "1px solid #e0e0e0",
        minWidth: 120,
      }}>
        {titulo}
      </div>
      <div style={{
        flex: 2,
        padding: 12,
        color: theme.text.secondary,
      }}>
        {valor || "No disponible"}
      </div>
    </div>
  );
}
