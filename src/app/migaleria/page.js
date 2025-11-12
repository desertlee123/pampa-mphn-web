// src/app/migaleria/page.js
"use client";
import { useTheme } from "../../context/ThemeContext";
export default function MiGaleriaPage() {
  const { theme } = useTheme();
  return (
    <div style={{ padding: 20, color: theme.text.primary }}>
      <h2>🖼️ Mi galería</h2>
      <p>Bienvenido a PAMPA MPHN (versión web mobile)</p>
    </div>
  );
}
