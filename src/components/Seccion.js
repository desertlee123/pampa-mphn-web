"use client";
import { useTheme } from "../context/ThemeContext";

export default function Seccion({ title, children }) {
  const { theme } = useTheme();

  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 12,
          color: theme.text.primary,
        }}
      >
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}
