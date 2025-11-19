// src/components/Seccion.js
"use client";
import { useTheme } from "../context/ThemeContext";

export default function Seccion({ title, children }) {
  const { theme } = useTheme();

  return (
    <div className="seccion-mobile" style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 12,
          color: theme.text.primary,
        }}
      >
        {title}
      </h2>

      <div>{children}</div>
    </div>
  );
}
