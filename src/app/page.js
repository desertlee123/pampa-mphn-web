// src/app/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logoutUser } from "../services/authService";

export default function Home() {
  const { session, setSession, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login"); // redirige si no hay sesión
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.background,
          color: theme.text.primary,
        }}
      >
        <p>Cargando...</p>
      </main>
    );
  }

  if (!session) return null; // mientras redirige, evita parpadeo

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    router.replace("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        background: theme.background,
        color: theme.text.primary,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>PAMPA MPHN - Web</h1>
        <p>Sesión activa: {session.email}</p>
        <p>Rol actual: {session.role}</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            background: theme.button.secondary,
            color: theme.button.text,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
