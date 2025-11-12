// src/app/escanearqr/page.js
"use client";
import { useTheme } from "../../context/ThemeContext";
export default function EscanearQrPage() {
  const { theme } = useTheme();
  return (
    <div style={{ padding: 20, color: theme.text.primary }}>
      <h2>📷 Escanear QR</h2>
      <p>Bienvenido a PAMPA MPHN (versión web mobile)</p>
    </div>
  );
}
