// src/app/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
      </div>
    </main>
  );
}
