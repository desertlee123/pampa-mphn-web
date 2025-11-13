// src/components/DesktopNavbar.js
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import {
  MdHome,
  MdPhotoLibrary,
  MdMovie,
  MdSearch,
} from "react-icons/md";

export default function DesktopNavbar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Inicio", icon: MdHome, path: "/" },
    { label: "Mi Galería", icon: MdPhotoLibrary, path: "/migaleria" },
    { label: "Shorts", icon: MdMovie, path: "/shorts" },
    { label: "Buscar", icon: MdSearch, path: "/buscar" },
  ];

  return (
    <nav
      className="desktop-navbar"
      style={{
        width: "100%",
        backgroundColor: theme.cardBackground,
        borderBottom: `1px solid ${theme.border}`,
        display: "none",
        justifyContent: "space-around",
        gap: 30,
        padding: "12px 0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {links.map(({ label, icon: Icon, path }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: active ? "bold" : "normal",
              color: active ? theme.tab.active : theme.text.secondary,
              fontSize: 20,
              transition: "color 0.2s",
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
