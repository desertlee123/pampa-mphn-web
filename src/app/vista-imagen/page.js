// src/app/vista-imagen/page.js
/* eslint-disable @next/next/no-img-element */
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";

export default function VistaImagenPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const handleBack = () => {
    router.back();
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
        position: "relative",
      }}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* Botón de retroceso */}
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0, 0, 0, 0.5)",
          border: "none",
          borderRadius: "50%",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          color: "white",
          fontSize: 24,
        }}
      >
        <IoArrowBack />
      </button>

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