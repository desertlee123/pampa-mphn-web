"use client";
import { IoArrowBack } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

/**
 * Componente cabecera de la galería
 * @param {{ galeria: object, onBack: Function }} props
 */
export default function GaleriaHeader({ galeria, onBack }) {
  const { theme } = useTheme();
  const autor = galeria?.autor ?? "Autor desconocido";
  const titulo = galeria?.titulo ?? "Sin título";
  const descripcion = galeria?.descripcion ?? "";

  return (
    <header
      style={{
        backgroundColor: theme.cardBackground,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      {/* Fila superior con back */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IoArrowBack size={24} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: 16, color: theme.text.primary }}>{autor}</p>
        <h2
          style={{
            fontSize: 26,
            marginTop: 4,
            color: theme.text.primary,
            fontWeight: "bold",
          }}
        >
          {titulo}
        </h2>
        {descripcion && (
          <p
            style={{
              marginTop: 8,
              fontSize: 15,
              color: theme.text.secondary,
            }}
          >
            {descripcion}
          </p>
        )}
      </div>
    </header>
  );
}
