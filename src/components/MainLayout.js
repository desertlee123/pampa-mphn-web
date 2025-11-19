// src/components/MainLayout.jsx
"use client";
import { usePathname } from "next/navigation";
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
      {/* BLOQUE FIJO SUPERIOR (Header + DesktopNavbar) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          backgroundColor: theme.cardBackground,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Header />
        <DesktopNavbar />
      </div>


      {/* Contenido dinámico */}
      <div
        className="main-layout-mobile"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: 120,
          width: "100%",
          margin: "0 auto",
          ...(pathname === "/shorts" && {
            paddingBottom: 0,
            overflowY: "hidden",
          }),
        }}
      >
        {children}
      </div>

      {/* Tab bar móvil */}
      <div className="mobile-tabbar">
        <TabBar />
      </div>
    </div >
  );
}
