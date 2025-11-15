// src/app/comentarios/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../services/api";
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

  // Cargar comentarios del artículo
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/comentarios/${id}`);

        if (response.ok) {
          const data = await response.json();
          setComentarios(Array.isArray(data) ? data : []);
        } else {
          setComentarios([]);
        }
      } catch (error) {
        console.error("Error cargando comentarios:", error);
        setComentarios([]);
      } finally {
        setLoading(false);
      }
    };

    cargarComentarios();
  }, [id]);

  // Enviar nuevo comentario
  const enviarComentario = async () => {
    if (!nuevoComentario.trim() || !session?.token || session.token === "VISITOR_MODE") {
      return;
    }

    try {
      setEnviando(true);

      const response = await fetch(`${API_BASE_URL}/usuarios/comentar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        body: JSON.stringify({
          id_articulo: parseInt(id),
          mensaje: nuevoComentario.trim()
        })
      });

      if (response.ok) {
        const nuevoComent = await response.json();
        setComentarios(prev => [nuevoComent, ...prev]);
        setNuevoComentario("");
      } else {
        alert("Error al enviar comentario");
      }
    } catch (error) {
      console.error("Error enviando comentario:", error);
      alert("Error al enviar comentario");
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarComentario();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: theme.cardBackground,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IoArrowBack size={24} color={theme.text.primary} />
        </button>

        <h2 style={{
          margin: 0,
          color: theme.text.primary,
          fontSize: 18,
          fontWeight: "bold"
        }}>
          Comentarios
        </h2>

        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IoClose size={24} color={theme.text.primary} />
        </button>
      </div>

      {/* Lista de comentarios */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", color: theme.text.secondary }}>
            Cargando comentarios...
          </div>
        ) : comentarios.length === 0 ? (
          <div style={{ textAlign: "center", color: theme.text.secondary }}>
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>
        ) : (
          comentarios.map((comentario) => (
            <div
              key={comentario.id}
              style={{
                padding: "12px",
                marginBottom: "12px",
                backgroundColor: theme.cardBackground,
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color: theme.text.primary,
                    fontSize: "14px",
                  }}
                >
                  {comentario.usuario?.name || "Usuario"}
                </span>
                <span
                  style={{
                    color: theme.text.secondary,
                    fontSize: "12px",
                  }}
                >
                  {new Date(comentario.fecha_publicacion).toLocaleDateString()}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: theme.text.primary,
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {comentario.mensaje}
              </p>

              {comentario.estado && comentario.estado !== "publicado" && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    backgroundColor: theme.primary + "20",
                    color: theme.primary,
                    borderRadius: "4px",
                    fontSize: "12px",
                    display: "inline-block",
                  }}
                >
                  {comentario.estado}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input para nuevo comentario */}
      {session?.token && session.token !== "VISITOR_MODE" ? (
        <div
          style={{
            padding: "16px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: theme.cardBackground,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu comentario... (máx. 250 caracteres)"
              maxLength={250}
              style={{
                flex: 1,
                minHeight: "40px",
                maxHeight: "120px",
                padding: "12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                backgroundColor: theme.input?.background || theme.background,
                color: theme.text.primary,
                fontSize: "14px",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <button
              onClick={enviarComentario}
              disabled={!nuevoComentario.trim() || enviando}
              style={{
                backgroundColor: nuevoComentario.trim() ? theme.primary : theme.border,
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: nuevoComentario.trim() && !enviando ? "pointer" : "not-allowed",
                opacity: nuevoComentario.trim() && !enviando ? 1 : 0.6,
              }}
            >
              {enviando ? (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: `2px solid transparent`,
                    borderTop: `2px solid white`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <IoPaperPlane size={18} color="white" />
              )}
            </button>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: "4px",
              fontSize: "12px",
              color: theme.text.secondary,
            }}
          >
            {nuevoComentario.length}/250
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "16px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: theme.cardBackground,
            textAlign: "center",
            color: theme.text.secondary,
          }}
        >
          Inicia sesión para poder comentar
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
