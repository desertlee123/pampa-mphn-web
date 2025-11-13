// app/comentarios/page.js
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

  const [comentarios, setComentarios] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingMsg, setEditingMsg] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const fetchComentariosRevision = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/comentarios/buscar?estado=revision`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (res.ok && data.comentarios) setComentarios(data.comentarios);
      else setComentarios([]);
    } catch (e) {
      console.error("fetchComentariosRevision error:", e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.role !== "admin") router.replace("/");
  }, [session, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && session?.role === "admin") {
        router.replace("/");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [session, router]);

  useEffect(() => {
    fetchComentariosRevision();
  }, [fetchComentariosRevision]);

  const handleBuscar = async () => {
    if (!session?.token) return;
    setLoading(true);
    setSearchPerformed(true);
    setSearchNotFound(false);
    setSelectedComment(null);

    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && query.append(k, v));

    try {
      const res = await fetch(`${API_BASE_URL}/comentarios/buscar?${query}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (res.status === 404) {
        setSearchNotFound(true);
        return;
      }
      const data = await res.json();
      if (res.ok && data.comentarios?.length) {
        const c = data.comentarios[0];
        setSelectedComment(c);
        setEditingMsg(c.mensaje || "");
      } else setSearchNotFound(true);
    } catch (e) {
      console.error("handleBuscar error:", e);
      setSearchNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccion = async (accion, estadoParam = null) => {
    if (!selectedComment) return;
    const body = {
      operation: accion === "delete" ? "delete" : "update",
      id_comentario: selectedComment.id,
    };
    if (accion === "update") {
      let desiredEstado = estadoParam;
      if (estadoParam === "publicado" && editingMsg !== selectedComment.mensaje)
        desiredEstado = "editado";
      if (desiredEstado) body.estado = desiredEstado;
      if (editingMsg !== selectedComment.mensaje) body.mensaje = editingMsg;
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
      if (res.ok) {
        setSelectedComment(null);
        setEditingMsg("");
        setSearchPerformed(false);
        setSearchNotFound(false);
        fetchComentariosRevision();
      }
    } catch (e) {
      console.error(e);
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
            : "#3b82f6";
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
        padding: 20,
        gap: 20,
        background: theme.background,
        color: theme.text.primary,
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* IZQUIERDA: solo revisión */}
      <div
        style={{
          width: "30%",
          border: `1px solid ${theme.border}`,
          overflowY: "auto",
          borderRadius: 8,
          padding: 16,
          backgroundColor: theme.cardBackground,
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
              }}
              style={{
                background:
                  selectedComment?.id === c.id
                    ? theme.comentario.seleccionado
                    : theme.comentario.noSeleccionado,
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: 18, color: theme.text.secondary }}
                  >
                    person
                  </span>
                  <strong>{c.usuario?.name || "Usuario"}</strong>
                </div>
                {renderEstado(c.estado)}
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                {c.mensaje.slice(0, 60)}...
              </p>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          rowGap: 20,
        }}
      >
        {/* DERECHA: control + detalle */}
        <section
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            backgroundColor: theme.cardBackground,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: "bold" }}>Buscar comentario</h3>

          <style jsx global>{`
            input:focus,
            select:focus,
            textarea:focus {
              outline: none;
              border-color: ${theme.primary} !important;
              transition: border-color 0.2s ease;
            }

            input[type="checkbox"]:checked {
              accent-color: ${theme.primary};
            }

            input[type="date"]::-webkit-calendar-picker-indicator {
              filter: ${theme.name === "dark"
              ? "invert(1) brightness(1.2)"
              : "invert(0)"
            };
            }
          `}</style>

          {/* Usuario */}
          <div>
            <label style={{ fontWeight: "500", display: "block", marginBottom: 6 }}>
              Usuario
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <input
                placeholder="nombre"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, nombre_usuario: e.target.value }))
                }
                style={{
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: theme.input.background,
                  border: "1px solid gray",
                  color: theme.text.primary,
                }}
              />
              <input
                placeholder="mail"
                type="email"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, mail_usuario: e.target.value }))
                }
                style={{
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: theme.input.background,
                  border: "1px solid gray",
                  color: theme.text.primary,
                }}
              />
              <input
                placeholder="id"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, id_usuario: e.target.value }))
                }
                style={{
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: theme.input.background,
                  border: "1px solid gray",
                  color: theme.text.primary,
                }}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, socio: e.target.checked ? "true" : "" }))
                  }
                />
                <span>Socio</span>
              </label>
            </div>
          </div>

          {/* Artículo */}
          <div>
            <label style={{ fontWeight: "500", display: "block", marginBottom: 6 }}>
              Artículo
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <input
                placeholder="nombre"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, nombre_articulo: e.target.value }))
                }
                style={{
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: theme.input.background,
                  border: "1px solid gray",
                  color: theme.text.primary,
                }}
              />
              <input
                placeholder="id"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, id_articulo: e.target.value }))
                }
                style={{
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: theme.input.background,
                  border: "1px solid gray",
                  color: theme.text.primary,
                }}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label style={{ fontWeight: "500", display: "block", marginBottom: 6 }}>
              Estado
            </label>
            <select
              onChange={(e) => setFilters((f) => ({ ...f, estado: e.target.value }))}
              defaultValue=""
              style={{
                padding: 6,
                borderRadius: 6,
                backgroundColor: theme.input.background,
                border: "1px solid gray",
                color: theme.text.primary,
              }}
            >
              <option value="">Todos</option>
              <option value="publicado">Publicado</option>
              <option value="rechazado">Rechazado</option>
              <option value="revision">Revisión</option>
              <option value="editado">Editado</option>
            </select>
          </div>

          {/* Contenido mensaje */}
          <div>
            <label style={{ fontWeight: "500", display: "block", marginBottom: 6 }}>
              Contenido del mensaje
            </label>
            <input
              placeholder="texto del comentario"
              onChange={(e) =>
                setFilters((f) => ({ ...f, mensaje: e.target.value }))
              }
              style={{
                padding: 6,
                borderRadius: 6,
                width: "100%",
                backgroundColor: theme.input.background,
                border: "1px solid gray",
                color: theme.text.primary,
              }}
            />
          </div>

          {/* Fecha */}
          <div>
            <label style={{ fontWeight: "500", display: "block", marginBottom: 6 }}>
              Fecha
            </label>
            <input
              type="date"
              onChange={(e) =>
                setFilters((f) => ({ ...f, fecha: e.target.value }))
              }
              style={{
                padding: 6,
                borderRadius: 6,
                backgroundColor: theme.input.background,
                border: "1px solid gray",
                color: theme.text.primary,
              }}
            />
          </div>

          {/* Botón */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button
              onClick={handleBuscar}
              style={{
                background: theme.primary,
                color: "#fff",
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Buscar
            </button>
          </div>
        </section>

        {/* PANEL DETALLE */}
        <div
          style={{
            flex: 1,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            backgroundColor: theme.cardBackground,
            padding: 16,
            overflowY: "auto",
          }}
        >
          {searchPerformed && searchNotFound && (
            <p style={{ textAlign: "center", marginTop: 20 }}>
              No se encontraron resultados.
            </p>
          )}
          {selectedComment && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: 22, color: theme.text.secondary }}
                  >
                    person
                  </span>
                  <div>
                    <h3>{selectedComment.usuario?.name}</h3>
                    <small>
                      {format(
                        new Date(selectedComment.created_at),
                        "dd/MM/yyyy HH:mm"
                      )}
                    </small>
                  </div>
                </div>
                {renderEstado(selectedComment.estado)}
              </div>

              <textarea
                value={editingMsg}
                onChange={(e) => setEditingMsg(e.target.value)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  height: 120,
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: theme.border,
                  color: theme.text.primary,
                  border: `1px solid ${theme.border}`,
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() => handleAccion("update", "publicado")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Publicar
                </button>
                <button
                  onClick={() => handleAccion("update", "rechazado")}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Rechazar
                </button>
                <button
                  onClick={() => handleAccion("delete")}
                  style={{
                    background: "#9ca3af",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setSelectedComment(null)}
                  style={{
                    background: "#6b7280",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() =>
                    router.push(`/articulo/${selectedComment.articulos_id}`)
                  }
                  style={{
                    background: theme.primary || "#3b82f6",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Ir al mensaje
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
