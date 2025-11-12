// src/components/AuthHeader.js
"use client";
import { MdMuseum } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

export default function AuthHeader() {
  const { theme } = useTheme();

  return (
    <div style={styles.header}>
      <div
        style={{
          ...styles.logoBox,
          backgroundColor: theme.primary,
        }}
      >
        <MdMuseum size={48} color="white" />
      </div>
      <h1 style={{
        ...styles.title,
        color: theme.text.primary,
        fontFamily: theme.fonts?.bold || "bold",
      }}>
        PAMPA MPHN
      </h1>
      <p style={{
        ...styles.subtitle,
        color: theme.text.secondary,
        fontFamily: theme.fonts?.regular || "inherit",
        marginBottom: 20,
      }}>
        Museo Provincial de Historia Natural
      </p>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    textAlign: "center",
  },
  logoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold", // Fallback si theme.fonts.bold no está disponible
    margin: 0,
    padding: 0,
  },
  subtitle: {
    fontSize: 14,
    margin: 0,
    padding: 0,
  },
};
