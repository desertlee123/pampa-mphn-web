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
        height: 70,
        backgroundColor: theme.cardBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: `1px solid ${theme.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(20px, 2vw, 28px)",
          fontWeight: "700",
          color: theme.text.primary,
          fontFamily: theme.fonts.bold,
          letterSpacing: "-0.5px",
        }}
      >
        PAMPA MPHN
      </h1>

      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.text.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isDark ? <MdWbSunny size={30} /> : <MdDarkMode size={30} />}
        </button>

        <button
          onClick={() => router.push("/perfil")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.text.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MdPersonOutline size={30} />
        </button>
      </div>
    </header>
  );
}
