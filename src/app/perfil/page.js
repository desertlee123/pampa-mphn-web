// /src/app/perfil/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoPerson, IoStar, IoLogOut, IoLogIn, IoCloseCircleOutline } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../services/api";
import { logoutUser } from "../../services/authService";
import { getSession, saveSession } from "../../services/storage";
import ModalCard from "../../components/ModalCard";

export default function PerfilPage() {
  const { theme } = useTheme();
  const { session, setSession } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [localSession, setLocalSession] = useState(null);

  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      const s = await getSession();
      setLocalSession(s);
      setLoading(false);
    };
    loadSession();
  }, [session]); // recarga cuando cambia el rol o se hace logout

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 60 }}>Cargando...</p>;
  }

  // --- Invitado ---
  if (!localSession) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: theme.text.primary,
          background: theme.background,
          minHeight: "100vh",
        }}
      >
        <IoPerson size={100} color="#999" />
        <h2>¡Hola, Invitado!</h2>
        <p>No has iniciado sesión aún.</p>
        <button
          onClick={() => router.push("/login")}
          style={{
            marginTop: 20,
            background: theme.primary,
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 24px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <IoLogIn style={{ marginRight: 6 }} />
          Iniciar sesión
        </button>
      </div>
    );
  }

  const { name, email, role, token } = localSession;
  const isPartner = role === "partner";

  const handleLogout = () => {
    setModal({
      title: "Cerrar sesión",
      message: "¿Seguro que querés salir?",
      confirmText: "Cerrar sesión",
      onConfirm: async () => {
        await logoutUser();
        setSession(null);
        setLocalSession(null);
        setModal(null);
        router.replace("/login");
      },
      onCancel: () => setModal(null),
    });
  };

  const handleLeavePartner = () => {
    setModal({
      title: "Cancelar suscripción",
      message: "¿Seguro que querés dejar de ser socio?",
      confirmText: "Sí, cancelar",
      cancelText: "No",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/user/role`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: "user" }),
          });

          if (!res.ok) throw new Error();
          const data = await res.json();
          const updated = { ...localSession, role: data.user.role };

          await saveSession(updated);
          setSession(updated);
          setLocalSession(updated);

          setModal({
            title: "Éxito",
            message: "Tu suscripción fue cancelada correctamente.",
            confirmText: "Aceptar",
            onConfirm: () => setModal(null),
          });
        } catch {
          setModal({
            title: "Error",
            message: "No se pudo cancelar la suscripción.",
            confirmText: "Aceptar",
            onConfirm: () => setModal(null),
          });
        }
      },
      onCancel: () => setModal(null),
    });
  };

  return (
    <main
      style={{
        background: theme.background,
        color: theme.text.primary,
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: theme.cardBackground,
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: 400,
          margin: "40px auto",
        }}
      >
        <div
          style={{
            border: `4px solid ${isPartner ? theme.primary : "#ccc"}`,
            borderRadius: "50%",
            width: 120,
            height: 120,
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
          }}
        >
          {isPartner ? (
            <IoStar size={64} color={theme.primary} />
          ) : (
            <IoPerson size={64} color={theme.text.secondary} />
          )}
        </div>

        <h2 style={{ margin: 0 }}>{name || "Usuario"}</h2>
        <p style={{ color: theme.text.secondary, margin: "6px 0 20px" }}>
          {email}
        </p>
        <p style={{ fontSize: 14, marginBottom: 20 }}>
          {isPartner
            ? "¡Gracias por ser socio! Acceso completo 🚀"
            : "Cuenta estándar. Podés suscribirte para obtener beneficios."}
        </p>

        {!isPartner && role === "user" && (
          <button
            onClick={() => router.push("/suscripcion")}
            style={{
              background: theme.primary,
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 12,
              width: "100%",
            }}
          >
            <IoStar style={{ marginRight: 6 }} />
            Convertirse en socio
          </button>
        )}

        {isPartner && (
          <button
            onClick={handleLeavePartner}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 12,
              width: "100%",
            }}
          >
            <IoCloseCircleOutline style={{ marginRight: 6 }} />
            Cancelar suscripción
          </button>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          <IoLogOut style={{ marginRight: 6 }} />
          Cerrar sesión
        </button>
      </div>
      <ModalCard
        open={!!modal}
        title={modal?.title}
        message={modal?.message}
        onConfirm={modal?.onConfirm}
        onCancel={modal?.onCancel}
        confirmText={modal?.confirmText}
        cancelText={modal?.cancelText}
        theme={theme}
      />
    </main>
  );
}
