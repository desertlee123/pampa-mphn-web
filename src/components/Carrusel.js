// src/components/Carrusel.js
"use client";

import CarruselElement from "./CarruselElement";

export default function Carrusel({ data = [] }) {
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "10px",
        paddingBottom: 10,
        paddingLeft: 16,
      }}
    >
      {data.map((item) => (
        <CarruselElement
          key={item.id}
          title={item.nombre}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
}
