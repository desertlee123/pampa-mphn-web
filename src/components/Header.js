// src/components/Header.jsx
"use client";
import { MdPersonOutline, MdWbSunny, MdDarkMode } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header
      style={{
        height: 60,
        backgroundColor: theme.cardBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: theme.text.primary,
          fontFamily: theme.fonts.bold,
        }}
      >
        PAMPA MPHN
      </h1>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.text.primary,
          }}
        >
          {isDark ? <MdWbSunny size={24} /> : <MdDarkMode size={24} />}
        </button>

        <button
          onClick={() => router.push("/perfil")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.text.primary,
          }}
        >
          <MdPersonOutline size={24} />
        </button>
      </div>
    </header>
  );
}
