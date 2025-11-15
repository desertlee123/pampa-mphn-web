// src/app/vista-imagen/page.js
/* eslint-disable @next/next/no-img-element */
"use client";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from "react";

export default function VistaImagenPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const { theme } = useTheme();

  const [scale, setScale] = useState(1);
  const lastScaleRef = useRef(1);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.01;
    let newScale = lastScaleRef.current + delta;

    // Limitar el zoom entre 1 y 5
    if (newScale < 1) newScale = 1;
    if (newScale > 5) newScale = 5;

    setScale(newScale);
    lastScaleRef.current = newScale;
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
      lastScaleRef.current = 2;
    } else {
      setScale(1);
      lastScaleRef.current = 1;
    }
  };

  return (
    <main
      style={{
        height: "100vh",
        backgroundColor: theme.cardBackground || "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        cursor: scale > 1 ? "grab" : "pointer",
      }}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={imageUrl}
        alt="Vista ampliada"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transform: `scale(${scale})`,
          transition: "transform 0.1s ease",
        }}
      />
    </main>
  );
}
