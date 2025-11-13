// /src/app/articulo/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

export default function ArticuloPage() {
  const { id } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/articulos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then(setArticulo)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p style={{ padding: 20 }}>Error: {error}</p>;
  if (!articulo) return <p style={{ padding: 20 }}>Cargando artículo...</p>;

  return (
    <main style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>{articulo.titulo}</h1>
    </main>
  );
}
