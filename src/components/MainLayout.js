// src/components/MainLayout.jsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import TabBar from "./TapBar"
import DesktopNavbar from "./DesktopNavBar";

export default function MainLayout({ children }) {
  const { theme } = useTheme();
  const pathname = usePathname();

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

      {/* Navegación de escritorio */}
      <DesktopNavbar />

      {/* Contenido dinámico */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 60,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {children}
      </div>

      {/* Tab bar móvil */}
      <div className="mobile-tabbar">
        <TabBar />
      </div>
    </div>
  );
}
