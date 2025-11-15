/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL, IMAGE_BASE_URL, getArticuloPorId, saveArticulo, checkIfArticleSaved } from "../../../services/api";
import Info from "../../../components/Info";
import Tabla from "../../../components/tabla/Tabla";
import Fila from "../../../components/tabla/Fila";
import MessageButton from "../../../components/MessageButton";
import { shareIcon, saveIcon } from "../../../components/Icons";
import { IoArrowBack } from "react-icons/io5";
// Importado el ModalCard
import ModalCard from "../../../components/ModalCard";

export default function ArticuloPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { session, setSession } = useAuth();

  const [loading, setLoading] = useState(true);
  const [articulo, setArticulo] = useState({
    autor: "Sin autor",
    titulo: "Sin titulo",
    descripcion: "Sin descripción",
    id: null,
    fecha_publicacion: "00/00/0000",
    imageUrl: null,
    metadatos: null,
    para_socios: false,
  });
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // Nuevo estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar artículo y verificar si está guardado
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true);

        // Cargar datos del artículo
        const articleData = await getArticuloPorId(id);
        setArticulo(articleData);

        // Verificar si está guardado
        if (session?.token && session.token !== "VISITOR_MODE") {
          const articleId = parseInt(id); // Convertir a número
          const saved = await checkIfArticleSaved(articleId, session);
          setIsSaved(saved);
        } else {
          console.log('👤 Usuario no autenticado, no se verifica guardado');
        }

      } catch (error) {
        console.log("Error al cargar los artículos: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
  }, [id, session]);

  // Función para guardar/desguardar artículo
  const handleSaveArticle = async () => {
    if (session?.role === 'visitor' || !session?.token || session.token === "VISITOR_MODE") {
      // Muestra el modal en lugar del alert
      setIsModalOpen(true);
      return;
    }

    try {
      setSaving(true);

      const result = await saveArticulo(articulo.id, session);

      if (result) {
        // Cambiar el estado basado en la respuesta del servidor
        setIsSaved(result.guardado);
      }

    } catch (error) {
      console.error("Error al guardar artículo:", error);
    } finally {
      setSaving(false);
    }
  };

  // Funciones para controlar el modal
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    // Navegar para registrarse o iniciar sesión
    router.push('/login');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // Función para compartir artículo (Web API)
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: articulo.titulo,
          text: articulo.descripcion,
          url: window.location.href,
        });
        console.log("Compartido exitosamente");
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href);
        alert("Enlace copiado al portapapeles");
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  // Función para navegar a vista de imagen
  const handleImagePress = () => {
    router.push(`/vista-imagen?imageUrl=${encodeURIComponent(articulo.imageUrl)}`);
  };

  // Función para retroceder
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: theme.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.text.primary,
        }}
      >
        <div style={{ width: 40, height: 40, border: `4px solid #FFA500`, borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  if (session?.role !== 'partner' && articulo.para_socios) {
    console.log('role: ', session?.role);

    switch (session?.role) {
      case 'visitor':
        return (
          <main
            style={{
              minHeight: "100vh",
              backgroundColor: theme.background,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: theme.text.primary,
              padding: 20,
              textAlign: "center",
            }}
          >
            <p>Sesión no válida. Contenido exclusivo para socios</p>
            <button
              onClick={() => setSession(null)}
              style={{
                color: "orange",
                marginTop: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Registrarse
            </button>
          </main>
        );
      case 'user':
        return (
          <main
            style={{
              minHeight: "100vh",
              backgroundColor: theme.background,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: theme.text.primary,
              padding: 20,
              textAlign: "center",
            }}
          >
            <p>Sesión no válida. Contenido exclusivo para socios.</p>
            <button
              onClick={() => router.push("/suscripcion")}
              style={{
                color: "orange",
                marginTop: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Volverse socio
            </button>
          </main>
        );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        position: "relative",
        paddingBottom: 80, // Espacio para el botón de mensajes
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Header con botones */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 16px 0 16px",
          }}
        >
          {/* Botón de retroceso */}
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.text.primary,
              fontSize: 24,
            }}
          >
            <IoArrowBack />
          </button>

          {/* Botones de la derecha */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Botón compartir */}
            <button
              onClick={handleShare}
              style={{
                marginRight: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                borderRadius: 8,
              }}
            >
              {shareIcon({ color: theme.text.primary })}
            </button>

            {/* Botón guardar con estado visual */}
            <button
              onClick={handleSaveArticle}
              disabled={saving}
              style={{
                background: "none",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                padding: 8,
                borderRadius: 8,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saveIcon({
                color: isSaved ? theme.primary : theme.text.primary,
                fill: isSaved ? theme.primary : 'transparent',
                stroke: isSaved ? theme.primary : theme.text.primary
              })}
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Info autor={articulo.autor} titulo={articulo.titulo} descripcion={articulo.descripcion} theme={theme} />

          {/* Imagen */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <button
              onClick={handleImagePress}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <img
                src={articulo.imageUrl}
                alt={articulo.titulo}
                style={{
                  width: "calc(100vw - 28px)",
                  height: "calc(100vw - 28px)",
                  maxWidth: "500px",
                  maxHeight: "500px",
                  borderRadius: 16,
                  objectFit: "contain",
                }}
              />
            </button>
          </div>

          {/* Metadatos */}
          {articulo.metadatos ? (
            <Tabla>
              <Fila titulo="Autor" valor={articulo.metadatos.autor} theme={theme} />
              <Fila titulo="Editor" valor={articulo.metadatos.editor} theme={theme} />
              <Fila titulo="Proveedor de datos" valor={articulo.metadatos.proveedor_de_datos} theme={theme} />
              <Fila titulo="Fecha creacion" valor={articulo.metadatos.fecha_creacion} theme={theme} />
              <Fila titulo="Pais proveedor" valor={articulo.metadatos.pais_proveedor} theme={theme} />
              <Fila titulo="Ultima actualizacion de proveedor" valor={articulo.metadatos.ultima_actualizacion_de_proveedor} theme={theme} />
              <Fila titulo="Descripcion" valor={articulo.metadatos.descripcion} theme={theme} />
              <Fila titulo="Created at" valor={articulo.metadatos.created_at} theme={theme} />
              <Fila titulo="Updated at" valor={articulo.metadatos.updated_at} theme={theme} />
            </Tabla>
          ) : (
            <p style={{ padding: 16, color: theme.text.primary, textAlign: "center" }}>No hay metadatos</p>
          )}
        </div>
      </div>

      {/* Botón de mensajes flotante (Ajuste de estilo para que no se tape) */}
      <MessageButton
        onClick={() => router.push(`/comentarios/${articulo.id}`)}
        theme={theme}
        style={{
          bottom: '20px',
          right: '20px',
          position: 'fixed',
          zIndex: 1000,
        }}
      />

      {/* Modal para usuarios no autenticados */}
      <ModalCard
        open={isModalOpen}
        title="Guardar Artículo"
        message="Para guardar artículos y usar todas las funciones, por favor, regístrate o inicia sesión."
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        confirmText="Registrarse / Iniciar Sesión"
        cancelText="Cancelar"
        theme={theme}
      />
    </div>
  );
}
