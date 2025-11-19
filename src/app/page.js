// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import Seccion from "../components/Seccion";
import Carrusel from "../components/Carrusel";
import Box from "../components/Box";

import {
  getAllArticulos,
  getLastArticulos,
  getAllCategorias
} from "../services/api";

export default function HomePage() {
  const { session, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [data, setData] = useState({
    loading: true,
    articulos: [],
    articulosRecientes: [],
    categorias: [],
  });

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    async function load() {
      try {
        const articulos = await getAllArticulos();
        const articulosRecientes = await getLastArticulos();
        const categorias = await getAllCategorias();

        setData({
          loading: false,
          articulos,
          articulosRecientes,
          categorias,
        });

      } catch (err) {
        console.error("Error cargando:", err);
      }
    }
    load();
  }, []);

  if (loading || data.loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.background,
          color: theme.text.primary,
        }}
      >
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        background: theme.background,
        color: theme.text.primary,
      }}
    >
      {/* CATEGORÍAS */}
      <Seccion title="Categorías">
        <Carrusel data={data.categorias} />
      </Seccion>

      {/* NOVEDADES */}
      <Seccion title="Novedades">
        <div
          className="articulos-grid"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            paddingBottom: 10,
          }}
        >
          {data.articulosRecientes.map((item) => (
            <Box
              className="novedad-box"
              key={item.id}
              title={item.titulo}
              imageUrl={item.imageUrl}
              paraSocios={item.para_socios}
              onClick={() => router.push(`/articulo/${item.id}`)}
            />
          ))}
        </div>
      </Seccion>

      {/* ARTÍCULOS */}
      <Seccion title="Artículos">
        <div
          className="articulos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
            paddingBottom: 40,
          }}
        >
          {data.articulos.map((item) => (
            <Box
              key={item.id}
              title={item.titulo}
              imageUrl={item.imageUrl}
              paraSocios={item.para_socios}
              onClick={() => router.push(`/articulo/${item.id}`)}
            />
          ))}
        </div>
      </Seccion>
    </main>
  );
}
