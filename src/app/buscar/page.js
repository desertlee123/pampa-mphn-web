// src/app/buscar/page.js
"use client";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL, IMAGE_BASE_URL } from "../../services/api";
import { IoSearch, IoCalendarOutline, IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Seccion from "../../components/Seccion";
import Box from "../../components/Box";

export default function BuscarPage() {
  const { theme } = useTheme();
  const { session } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [galerias, setGalerias] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Normaliza rutas relativas a URL completa
  /* const normalizeImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL.replace("/api", "")}/${clean}`;
  }; */

  const isoFromDate = (dateObj) => {
    if (!dateObj) return null;
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const d = dateObj.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const fetchJSONSafe = async (url) => {
    try {
      const res = await fetch(url);
      if (res.status === 404) return [];
      const data = await res.json();
      if (data && data.message && !Array.isArray(data)) return [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("fetchJSONSafe error", err, url);
      return [];
    }
  };

  const buildQuery = (params) => {
    const parts = [];
    for (const k in params) {
      if (params[k] != null && params[k] !== "") {
        parts.push(`${k}=${encodeURIComponent(params[k])}`);
      }
    }
    return parts.length ? `?${parts.join("&")}` : "";
  };

  const handleSearch = async () => {
    const text = (searchText || "").trim();
    if (!text && !selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const fechaParam = selectedDate ? isoFromDate(selectedDate) : null;

      // --- Artículos ---
      const articleQueries = [
        { titulo: text, fecha: fechaParam },
        { autor: text, fecha: fechaParam },
        { categoria: text, fecha: fechaParam },
      ];

      const articlePromises = articleQueries.map((q) =>
        fetchJSONSafe(`${API_BASE_URL}/articulos/buscar${buildQuery(q)}`)
      );

      const articleArrays = await Promise.all(articlePromises);
      const articleMap = new Map();
      articleArrays.flat().forEach((a) => {
        if (!articleMap.has(a.id)) {
          const img = a.imagen ? `${IMAGE_BASE_URL}/${a.imagen}` : null;
          articleMap.set(a.id, { ...a, imagen: img });
        }
      });
      let normalizedArticulos = Array.from(articleMap.values());

      // --- Galerías ---
      const galleryQueries = [
        { titulo: text, fecha: fechaParam },
        { autor: text, fecha: fechaParam },
      ];
      const galleryPromises = galleryQueries.map((q) =>
        fetchJSONSafe(`${API_BASE_URL}/galerias/buscar${buildQuery(q)}`)
      );
      const galleryArrays = await Promise.all(galleryPromises);
      const galMap = new Map();
      galleryArrays.flat().forEach((g) => {
        if (!galMap.has(g.id)) galMap.set(g.id, g);
      });
      let galList = Array.from(galMap.values());

      if (galList.length) {
        const detailPromises = galList.map(async (g) => {
          try {
            const res = await fetch(`${API_BASE_URL}/galerias/${g.id}`);
            if (!res.ok) return { ...g, imagen: null };
            const data = await res.json();
            const rawImgPath = data?.articulos?.[0]?.imagen ?? null;
            const img = rawImgPath ? `${IMAGE_BASE_URL}/${rawImgPath}` : null;
            return { ...g, imagen: img };
          } catch {
            return { ...g, imagen: null };
          }
        });
        galList = await Promise.all(detailPromises);
      }

      setArticulos(normalizedArticulos);
      setGalerias(galList);

      if (normalizedArticulos.length === 0 && galList.length === 0) {
        setError("No se encontraron resultados.");
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const clearDate = () => setSelectedDate(null);

  const handleArticleClick = (articleId) => {
    router.push(`/articulo/${articleId}`);
  };

  const handleGalleryClick = (galleryId) => {
    router.push(`/galeria/${galleryId}`);
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: theme.background,
        padding: 16,
        color: theme.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* Campo de búsqueda */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${theme.input.border}`,
          backgroundColor: theme.input.background,
          borderRadius: 10,
          padding: "8px 12px",
          marginBottom: 12,
        }}
      >
        <IoSearch size={22} color={theme.text.secondary} style={{ marginRight: 8 }} />
        <input
          type="text"
          placeholder="Buscar por título, autor o categoría..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            fontSize: 16,
            border: "none",
            outline: "none",
            background: "transparent",
            color: theme.text.primary,
          }}
        />
      </div>

      {/* Selector de fecha */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: theme.border,
            padding: "10px",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <IoCalendarOutline
            size={20}
            color={theme.text.secondary}
            style={{ marginRight: 8 }}
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Seleccionar fecha (opcional)"
            dateFormat="yyyy-MM-dd"
            className="datepicker-input"
            customInput={
              <span style={{ color: theme.text.primary, fontSize: 16 }}>
                {selectedDate
                  ? `Fecha: ${isoFromDate(selectedDate)}`
                  : "Seleccionar fecha (opcional)"}
              </span>
            }
          />
        </div>

        {selectedDate && (
          <button
            onClick={clearDate}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: theme.cardBackground,
              border: `1px solid ${theme.input.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <IoClose size={20} color="#666" />
          </button>
        )}
      </div>

      {/* Botón buscar */}
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: theme.primary,
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 10,
          padding: "12px",
          width: "100%",
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        Buscar
      </button>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", margin: 20 }}>
          <div className="spinner" style={{ color: theme.primary }}>
            ⏳ Cargando...
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "red", textAlign: "center", margin: 12 }}>{error}</p>
      )}

      {/* Resultados */}
      {!loading && !error && (galerias.length > 0 || articulos.length > 0) && (
        <div>
          {galerias.length > 0 && (
            <Seccion title="Galerías encontradas">
              <div
                className="articulos-grid"
                style={{
                  display: "flex",
                  gap: 16,
                  overflowX: "auto",
                  paddingBottom: 8,
                }}
              >
                {galerias.map((g) => (
                  <Box
                    key={g.id}
                    title={g.titulo}
                    imageUrl={g.imagen}
                    onClick={() => handleGalleryClick(g.id)}
                    id={g.id}
                  />
                ))}
              </div>
            </Seccion>
          )}

          {articulos.length > 0 && (
            <Seccion title="Artículos encontrados">
              <div
                className="articulos-grid"
                style={{
                  display: "flex",
                  gap: 16,
                  overflowX: "auto",
                  paddingBottom: 8,
                }}
              >
                {articulos.map((a) => (
                  <Box
                    key={a.id}
                    title={a.titulo}
                    imageUrl={a.imagen}
                    paraSocios={a.para_socios}
                    esSocio={session?.role === "partner"}
                    onClick={() => handleArticleClick(a.id)}
                    id={a.id}
                  />
                ))}
              </div>
            </Seccion>
          )}
        </div>
      )}
    </div>
  );
}
