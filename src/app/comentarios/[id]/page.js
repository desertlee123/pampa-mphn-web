// src/app/comentarios/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { getComentarios, crearComentario } from "../../../services/api";
import ComentarioItem from "../../../components/ComentarioItem";
import ModalCard from "../../../components/ModalCard";
import { IoClose, IoArrowBack, IoPaperPlane } from "react-icons/io5";

export default function ComentariosPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { session } = useAuth();

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    cargarComentarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function cargarComentarios() {
    try {
      setLoading(true);
      const data = await getComentarios(id);
      setComentarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) return;
    if (!session?.token || session.token === "VISITOR_MODE") {
      setModalMessage("Debes iniciar sesión para comentar.");
      setModalOpen(true);
      return;
    }
    if (nuevoComentario.length > 250) {
      setModalMessage("El comentario no puede exceder 250 caracteres.");
      setModalOpen(true);
      return;
    }

    try {
      setEnviando(true);
      const creado = await crearComentario(nuevoComentario, id, session);
      // según API devuelve el comentario creado (estado "revision")
      if (creado) {
        // Opciones: precargar con el usuario local o recargar la lista
        // mejor recargar (asegura consistencia)
        setNuevoComentario("");
        await cargarComentarios();
        setModalMessage("Tu comentario fue enviado a revisión y puede tardar alrededor de 24 horas en publicarse.");
        setModalOpen(true);
      } else {
        setModalMessage("No se pudo enviar el comentario.");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error enviando:", err);
      setModalMessage(typeof err === "string" ? err : (err.message || "Error al enviar comentario"));
      setModalOpen(true);
    } finally {
      setEnviando(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarComentario();
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: theme.background, display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: 16, borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.cardBackground
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <IoArrowBack size={24} color={theme.text.primary} />
        </button>

        <h2 style={{ margin: 0, color: theme.text.primary, fontSize: 18, fontWeight: "bold" }}>
          Comentarios
        </h2>

        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <IoClose size={24} color={theme.text.primary} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: theme.text.secondary }}>Cargando comentarios...</div>
        ) : comentarios.length === 0 ? (
          <div style={{ textAlign: "center", color: theme.text.secondary }}>No hay comentarios aún. ¡Sé el primero en comentar!</div>
        ) : (
          comentarios.map(c => (
            <ComentarioItem key={c.id} comentario={c} theme={theme} session={session} />
          ))
        )}
      </div>

      {session?.token && session.token !== "VISITOR_MODE" ? (
        <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, backgroundColor: theme.cardBackground }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu comentario... (máx. 250 caracteres)"
              maxLength={250}
              style={{
                flex: 1, minHeight: 40, maxHeight: 120,
                padding: 12, border: `1px solid ${theme.border}`,
                borderRadius: 20, backgroundColor: theme.input?.background || theme.background,
                color: theme.text.primary, fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit"
              }}
            />
            <button
              onClick={enviarComentario}
              disabled={!nuevoComentario.trim() || enviando}
              style={{
                backgroundColor: nuevoComentario.trim() ? theme.primary : theme.border,
                color: "white", border: "none",
                borderRadius: "50%", width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: nuevoComentario.trim() && !enviando ? "pointer" : "not-allowed", opacity: nuevoComentario.trim() && !enviando ? 1 : 0.6
              }}>
              {enviando ? (
                <div style={{ width: 16, height: 16, border: "2px solid transparent", borderTop: `2px solid white`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              ) : (
                <IoPaperPlane size={18} color="white" />
              )}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: 4, fontSize: 12, color: theme.text.secondary }}>
            {nuevoComentario.length}/250
          </div>
        </div>
      ) : (
        <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, backgroundColor: theme.cardBackground, textAlign: "center", color: theme.text.secondary }}>
          Inicia sesión para poder comentar
        </div>
      )}

      <ModalCard
        open={modalOpen}
        title="Comentario"
        message={modalMessage}
        onConfirm={() => setModalOpen(false)}
        theme={theme}
      />

      <style jsx>{`@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
