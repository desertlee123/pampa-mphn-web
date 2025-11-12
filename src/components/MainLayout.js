// src/components/MainLayout.jsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import TabBar from "./TapBar"

export default function MainLayout({ children }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Evitar mostrar el layout en login o signin
  if (pathname.startsWith("/login") || pathname.startsWith("/signin")) {
    return children;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text.primary,
      }}
    >
      {/* Encabezado */}
      <Header />

      {/* Contenido dinámico */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }}>
        {children}
      </div>

      {/* Tab bar inferior */}
      <TabBar />
    </div>
  );
}
