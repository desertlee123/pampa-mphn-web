// src/components/Info.js
export default function Info({ autor, titulo, descripcion, theme }) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{
        fontSize: 16,
        fontFamily: theme.fonts?.regular || "Arial, sans-serif",
        color: theme.text.primary,
        margin: 0
      }}>
        {autor}
      </p>
      <h1 style={{
        fontSize: 28,
        fontFamily: theme.fonts?.bold || "Arial, sans-serif",
        marginTop: 4,
        color: theme.text.primary,
        margin: 0,
        fontWeight: "bold"
      }}>
        {titulo}
      </h1>
      <p style={{
        marginTop: 8,
        fontSize: 15,
        color: theme.text.primary,
        fontFamily: theme.fonts?.regular || "Arial, sans-serif",
        lineHeight: 1.4
      }}>
        {descripcion}
      </p>
      <div style={{ height: 16 }} />
    </div>
  );
}
