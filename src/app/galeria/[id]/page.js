// src/app/galeria/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL, IMAGE_BASE_URL } from "../../../services/api";
import Box from "../../../components/Box";
import GaleriaHeader from "../../../components/GaleriaHeader";

export default function GaleriaAutorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { session } = useAuth();

  const [galeria, setGaleria] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galRes = await fetch(`${API_BASE_URL}/galerias/${id}`);
        const galData = await galRes.json();
        setGaleria(galData);

        const artRes = await fetch(`${API_BASE_URL}/articulos/galeria/${id}`);
        const artData = await artRes.json();

        const filtrados = Array.isArray(artData)
          ? artData.map((a) => ({ ...a, imagen: `${IMAGE_BASE_URL}/${a.imagen}` }))
          : [];

        setArticulos(filtrados);
      } catch (err) {
        console.error("Error cargando galería:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, session]);

  const handleArticleClick = (articleId) => {
    router.push(`/articulo/${articleId}`);
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
        <p>Cargando galería...</p>
      </main>
    );
  }

  if (!galeria) {
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
        <p>No se encontró la galería.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text.primary,
        paddingBottom: 80,
      }}
    >
      <GaleriaHeader galeria={galeria} onBack={() => router.back()} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          padding: 16,
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
    </main>
  );
}
