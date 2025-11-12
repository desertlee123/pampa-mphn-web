// /src/app/suscripcion/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoStar, IoRadioButtonOn, IoRadioButtonOff } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getSession, saveSession } from "../../services/storage";
import { API_BASE_URL } from "../../services/api";
import ModalCard from "../../components/ModalCard";

export default function SuscripcionPage() {
  const { theme } = useTheme();
  const { setSession } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // <-- agregamos modal
  const MP_URL = "https://mpago.la/2BkJCW8";

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Abre MP
      window.open(MP_URL, "_blank");

      // Obtiene sesión y actualiza rol
      const s = await getSession();
      const res = await fetch(`${API_BASE_URL}/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s.token}`,
        },
        body: JSON.stringify({ role: "partner" }),
      });

      if (!res.ok) throw new Error("Error al actualizar rol");
      const data = await res.json();

      const updated = { ...s, role: data.user.role };
      await saveSession(updated);
      setSession(updated);

      // Modal de éxito
      setModal({
        title: "¡Suscripción activada!",
        message: "Tu membresía se activó exitosamente 🎉",
        confirmText: "Ir a mi perfil",
        onConfirm: () => {
          setModal(null);
          router.replace("/perfil");
        },
      });
    } catch (err) {
      // Modal de error
      setModal({
        title: "Error",
        message: "No se pudo completar la suscripción. Intenta nuevamente.",
        confirmText: "Cerrar",
        onConfirm: () => setModal(null),
      });
    } finally {
      setLoading(false);
    }
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
          background: theme.primary,
          width: 140,
          height: 140,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        <IoStar size={96} color="white" />
      </div>

      <h2>Conviértete en Socio</h2>
      <p style={{ color: theme.text.secondary, marginBottom: 24 }}>
        Obtené beneficios exclusivos, acceso a eventos y contenido premium.
      </p>

      <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "left" }}>
        {/* Plan anual */}
        <div
          onClick={() => setSelectedPlan("annual")}
          style={{
            border: `2px solid ${selectedPlan === "annual" ? theme.primary : theme.border
              }`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {selectedPlan === "annual" ? (
                <IoRadioButtonOn color={theme.primary} />
              ) : (
                <IoRadioButtonOff color={theme.text.secondary} />
              )}
              <div>
                <strong>Anual</strong>
                <p style={{ margin: 0, color: theme.text.secondary }}>
                  $60.000/año
                </p>
              </div>
            </div>
            <span>$5.000/mes</span>
          </div>
        </div>

        {/* Plan mensual */}
        <div
          onClick={() => setSelectedPlan("monthly")}
          style={{
            border: `2px solid ${selectedPlan === "monthly" ? theme.primary : theme.border
              }`,
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {selectedPlan === "monthly" ? (
                <IoRadioButtonOn color={theme.primary} />
              ) : (
                <IoRadioButtonOff color={theme.text.secondary} />
              )}
              <div>
                <strong>Mensual</strong>
              </div>
            </div>
            <span>$7.000/mes</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          marginTop: 30,
          background: theme.primary,
          color: "white",
          border: "none",
          borderRadius: 12,
          padding: "16px 24px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          maxWidth: 400,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Procesando..." : "Suscribirse ahora"}
      </button>

      {/* ✅ ModalCard al final */}
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
