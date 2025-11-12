// src/components/TabBar.jsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import {
  MdHome,
  MdPhotoLibrary,
  MdMovie,
  MdSearch,
  MdQrCodeScanner,
} from "react-icons/md";

export default function TabBar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: "Home", icon: MdHome, path: "/" },
    { label: "Mi galería", icon: MdPhotoLibrary, path: "/migaleria" },
    { label: "Shorts", icon: MdMovie, path: "/shorts" },
    { label: "Buscar", icon: MdSearch, path: "/buscar" },
    { label: "QR", icon: MdQrCodeScanner, path: "/escanearqr" },
  ];

  return (
    <nav
      style={{
        height: 60,
        backgroundColor: theme.tab.background,
        borderTop: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: active ? theme.tab.active : theme.tab.inactive,
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: 11, marginTop: 2 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
