// src/app/migaleria/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL, IMAGE_BASE_URL } from "../../services/api";
import Seccion from "../../components/Seccion";
import Box from "../../components/Box";

export default function MiGaleriaPage() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [misArticulos, setMisArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticulosGuardados = async () => {
    // Verificar sesión antes de hacer la petición
    if (!session?.token) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/usuarios/articulos/guardados`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (data.articulos) {
        const articulosProcesados = data.articulos.map(articulo => ({
          ...articulo,
          imageUrl: articulo.imagen ? `${IMAGE_BASE_URL}/${articulo.imagen}` : null
        }));
        setMisArticulos(articulosProcesados);
      } else {
        setMisArticulos([]);
      }

    } catch (error) {
      console.error("Error al cargar artículos guardados:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      loadArticulosGuardados();
    } else {
      setError("No hay sesión activa");
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleArticleClick = (articleId) => {
    router.push(`/articulo/${articleId}`);
  };

  const handleRetry = () => {
    loadArticulosGuardados();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleExploreArticles = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `4px solid ${theme.primary}`,
            borderTop: "4px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ 
          marginTop: 16, 
          fontSize: 16, 
          color: theme.text.primary 
        }}>
          Cargando tus artículos guardados...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <p style={{ 
          color: theme.error || "#ff3b30", 
          marginBottom: 16, 
          textAlign: "center",
          fontSize: 16 
        }}>
          Error: {error}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: theme.primary,
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Reintentar
          </button>
          <button
            onClick={handleGoHome}
            style={{
              backgroundColor: "transparent",
              color: theme.primary,
              border: `1px solid ${theme.primary}`,
              borderRadius: 8,
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Ir a Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        padding: "16px",
        paddingBottom: "80px", // Espacio para la tab bar en mobile
      }}
    >
      <Seccion title="Mi Galería">
        <p style={{ 
          fontSize: 16, 
          textAlign: "center", 
          marginBottom: 20, 
          color: theme.text.secondary,
          margin: 0 
        }}>
          {misArticulos.length} artículo{misArticulos.length !== 1 ? 's' : ''} guardado{misArticulos.length !== 1 ? 's' : ''}
        </p>
      </Seccion>

      {misArticulos.length === 0 ? (
        <div
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 40px",
            textAlign: "center",
          }}
        >
          <p style={{ 
            fontSize: 18, 
            fontWeight: "bold", 
            marginBottom: 8, 
            color: theme.text.primary 
          }}>
            No tienes artículos guardados
          </p>
          <p style={{ 
            fontSize: 14, 
            marginBottom: 20, 
            color: theme.text.secondary 
          }}>
            Los artículos que guardes aparecerán aquí
          </p>
          <button
            onClick={handleExploreArticles}
            style={{
              backgroundColor: theme.primary,
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Explorar Artículos
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
            paddingBottom: 20,
          }}
          className="articles-grid"
        >
          {misArticulos.map((item) => (
            <Box
              key={item.id}
              title={item.titulo}
              imageUrl={item.imageUrl}
              paraSocios={item.para_socios ? 1 : 0}
              esSocio={session?.role === "socio"}
              onClick={() => handleArticleClick(item.id)}
              id={item.id}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        /* Mobile First */
        .articles-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        /* Tablet */
        @media (min-width: 768px) {
          .articles-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .articles-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          
          div:first-child {
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
          }
        }

        /* Large Desktop */
        @media (min-width: 1440px) {
          .articles-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
