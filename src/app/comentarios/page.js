"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { API_BASE_URL } from "@/services/api";

export default function ComentariosAdmin() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [comentarios, setComentarios] = useState([]); // lista izquierda -> SOLO revision
  const [selectedComment, setSelectedComment] = useState(null); // panel detalle (derecha abajo)
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingMsg, setEditingMsg] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // --- 1) traer solo comentarios en estado "revision" (lista izquierda)
  const fetchComentariosRevision = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/comentarios/buscar?estado=revision`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.comentarios) {
        setComentarios(data.comentarios);
      } else {
        setComentarios([]);
      }
    } catch (e) {
      console.error("fetchComentariosRevision error:", e);
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // si no es admin, redirige
  useEffect(() => {
    if (!session) return;
    if (session.role !== "admin") router.replace("/");
  }, [session, router]);

  // carga inicial: comentarios en revision
  useEffect(() => {
    fetchComentariosRevision();
  }, [fetchComentariosRevision]);

  // --- 2) manejar búsqueda (panel de control)
  const handleBuscar = async () => {
    if (!session?.token) return;
    setLoading(true);
    setSearchPerformed(true);
    setSearchNotFound(false);
    setSelectedComment(null);

    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });

    try {
      const res = await fetch(
        `${API_BASE_URL}/comentarios/buscar?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      // Si 404 -> no results
      if (res.status === 404) {
        setSearchNotFound(true);
        setSelectedComment(null);
        return;
      }

      const data = await res.json();
      if (res.ok && data.comentarios && data.comentarios.length > 0) {
        // desplegar el primer resultado en el panel detalle (derecha abajo)
        const primer = data.comentarios[0];
        setSelectedComment(primer);
        setEditingMsg(primer.mensaje || "");
        setSearchNotFound(false);
      } else {
        setSearchNotFound(true);
        setSelectedComment(null);
      }
    } catch (e) {
      console.error("handleBuscar error:", e);
      setSearchNotFound(true);
      setSelectedComment(null);
    } finally {
      setLoading(false);
    }
  };

  // --- 3) acciones: publicar, rechazar, editar, eliminar
  const handleAccion = async (accion, estadoParam = null) => {
    if (!session?.token) return;
    // cuando eliminar:
    if (accion === "delete" && !selectedComment) return;

    const body = {
      operation: accion === "delete" ? "delete" : "update",
      id_comentario: selectedComment?.id,
    };

    // si es update, decidimos estado final considerando edición por admin
    if (accion === "update") {
      // si quieren publicar y el admin modificó el mensaje -> marcar "editado"
      let desiredEstado = estadoParam ?? null;
      if (estadoParam === "publicado" && editingMsg !== selectedComment.mensaje) {
        desiredEstado = "editado";
      }
      if (desiredEstado) body.estado = desiredEstado;

      // si modificó mensaje, lo enviamos
      if (editingMsg !== selectedComment.mensaje) {
        body.mensaje = editingMsg;
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // opcional: parsear errores y mostrar alert/console
        const err = await res.json().catch(() => null);
        console.error("API error:", err);
      } else {
        // acción OK:
        //  - refrescar la lista de revisión (para mantener la lista izquierda consistente)
        //  - limpiar panel detalle
        setSelectedComment(null);
        setEditingMsg("");
        setSearchPerformed(false);
        setSearchNotFound(false);
        await fetchComentariosRevision();
      }
    } catch (e) {
      console.error("handleAccion fetch error:", e);
    }
  };

  const renderEstado = (estado) => {
    const color =
      estado === "revision"
        ? "#f59e0b"
        : estado === "publicado"
          ? "#10b981"
          : estado === "rechazado"
            ? "#ef4444"
            : "#3b82f6"; // editado -> azul
    return (
      <span
        style={{
          background: color,
          color: "#fff",
          padding: "2px 8px",
          borderRadius: 6,
          fontSize: 12,
          textTransform: "capitalize",
        }}
      >
        {estado}
      </span>
    );
  };

  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 70px)",
        background: theme.background,
        color: theme.text.primary,
        overflow: "hidden",
      }}
    >
      {/* PANEL IZQUIERDO: SOLO comentarios en 'revision' */}
      <div
        style={{
          width: "30%",
          borderRight: `1px solid ${theme.border}`,
          overflowY: "auto",
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>En revisión</h2>

        {loading && !searchPerformed ? (
          <p>Cargando...</p>
        ) : comentarios.length === 0 ? (
          <p>No hay comentarios en revisión.</p>
        ) : (
          comentarios.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedComment(c);
                setEditingMsg(c.mensaje);
                setSearchPerformed(false);
                setSearchNotFound(false);
              }}
              style={{
                background:
                  selectedComment?.id === c.id ? theme.cardBackground : "transparent",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{c.usuario?.name || "Usuario"}</strong>
                {renderEstado(c.estado)}
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                {c.mensaje.length > 60 ? c.mensaje.slice(0, 60) + "..." : c.mensaje}
              </p>
            </div>
          ))
        )}
      </div>

      {/* PANEL DERECHO: panel de control arriba + detalle abajo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 16,
          gap: 12,
          overflow: "hidden",
        }}
      >
        {/* PANEL DE CONTROL */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            border: `1px solid ${theme.border}`,
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <input
            placeholder="Nombre usuario"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, nombre_usuario: e.target.value }))
            }
            style={{ padding: 6, borderRadius: 6, flex: "1", minWidth: 160 }}
          />
          <input
            placeholder="ID artículo"
            onChange={(e) => setFilters((prev) => ({ ...prev, id_articulo: e.target.value }))}
            style={{ padding: 6, borderRadius: 6, minWidth: 120 }}
          />
          <input
            type="date"
            onChange={(e) => setFilters((prev) => ({ ...prev, fecha: e.target.value }))}
            style={{ padding: 6, borderRadius: 6 }}
          />
          <select
            onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
            style={{ padding: 6, borderRadius: 6 }}
            defaultValue=""
          >
            <option value="">Estado</option>
            <option value="revision">Revisión</option>
            <option value="publicado">Publicado</option>
            <option value="rechazado">Rechazado</option>
            <option value="editado">Editado</option>
          </select>
          <button
            onClick={handleBuscar}
            style={{
              background: theme.accent || theme.primary,
              color: "#fff",
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </div>

        {/* PANEL DE DETALLE / RESULTADO DE BUSQUEDA (ABAJO) */}
        <div
          style={{
            flex: 1,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: 16,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Si se realizó una búsqueda y NO hay resultados -> mostrar mensaje */}
          {searchPerformed && searchNotFound && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <p style={{ fontSize: 16 }}>No se encontraron resultados.</p>
            </div>
          )}

          {/* Si hay un comentario seleccionado (venga de la lista o de la búsqueda) -> mostrar detalle */}
          {selectedComment ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <h3 style={{ marginBottom: 4 }}>{selectedComment.usuario?.name}</h3>
                  <small>
                    {selectedComment.created_at
                      ? format(new Date(selectedComment.created_at), "dd/MM/yyyy HH:mm")
                      : ""}
                  </small>
                </div>
                {renderEstado(selectedComment.estado)}
              </div>

              <textarea
                value={editingMsg}
                onChange={(e) => setEditingMsg(e.target.value)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  height: 160,
                  padding: 8,
                  borderRadius: 6,
                  background: theme.cardBackground,
                  color: theme.text.primary,
                  border: `1px solid ${theme.border}`,
                  boxSizing: "border-box",
                }}
              />

              <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleAccion("update", "publicado")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Publicar
                </button>

                <button
                  onClick={() => handleAccion("update", "rechazado")}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Rechazar
                </button>

                <button
                  onClick={() => {
                    handleAccion("delete");
                  }}
                  style={{
                    background: "#9ca3af",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>

                <button
                  onClick={() => {
                    setSelectedComment(null);
                    setEditingMsg("");
                    setSearchPerformed(false);
                    setSearchNotFound(false);
                  }}
                  style={{
                    background: "#6b7280",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Cerrar
                </button>
              </div>
            </>
          ) : (
            // Si no hay comentario seleccionado y no buscaste -> mostrar hint o vacio
            !searchPerformed && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <p style={{ fontSize: 16 }}>Seleccioná un comentario de la lista o buscá uno arriba.</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
