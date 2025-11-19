// src/components/ComentarioItem.js
"use client";
import React from "react";

export default function ComentarioItem({ comentario, theme, session }) {
  const calcularTiempoTranscurrido = (fecha) => {
    try {
      const ahora = new Date();
      const fechaComentario = new Date(fecha);
      const diff = ahora - fechaComentario;
      const minutos = Math.floor(diff / 60000);
      const horas = Math.floor(diff / 3600000);
      const dias = Math.floor(diff / 86400000);
      if (minutos < 1) return "hace unos segundos";
      if (minutos < 60) return `hace ${minutos}m`;
      if (horas < 24) return `hace ${horas}h`;
      if (dias < 7) return `hace ${dias}d`;
      return fechaComentario.toLocaleDateString("es-ES");
    } catch {
      return "";
    }
  };

  const obtenerInicial = (nombre) => (nombre ? nombre.charAt(0).toUpperCase() : "U");
  const nombreUsuario = comentario.usuario?.nombre || "Usuario";
  const esUsuarioActual = comentario.usuario_id === session?.id;

  return (
    <div style={{ padding: 12 }}>
      <div style={{
        display: "flex",
        gap: 12,
        background: theme.highlightBackground,
        borderRadius: 12,
        padding: 12,
        border: `1px solid ${theme.border}`
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: theme.primary, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: theme.text.primary, fontWeight: 700 }}>{obtenerInicial(nombreUsuario)}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <div style={{ fontWeight: 700, color: theme.text.primary }}>{nombreUsuario}</div>
            <div style={{ color: theme.text.secondary, fontSize: 13 }}>
              {calcularTiempoTranscurrido(comentario.created_at || comentario.fecha_publicacion)}
            </div>
          </div>
          <div style={{ color: theme.text.primary, lineHeight: 1.4 }}>
            {comentario.mensaje}
          </div>
          {comentario.estado && comentario.estado !== "publicado" && (
            <div style={{
              marginTop: 8, padding: "4px 8px",
              background: theme.primary + "20",
              color: theme.primary,
              borderRadius: 4,
              fontSize: 12,
              display: "inline-block",
            }}>
              {comentario.estado}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
