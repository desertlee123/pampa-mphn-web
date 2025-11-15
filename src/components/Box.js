// src/components/Box.js
/* eslint-disable @next/next/no-img-element */
"use client";
import { IoStar } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

export default function Box({ title, imageUrl, paraSocios, esSocio, onClick, id }) {
  const { theme } = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: "100%",
        maxWidth: "160px",
        backgroundColor: theme.cardBackground,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "pointer",
        marginBottom: 12,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            height: "120px",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            objectFit: "cover",
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "120px",
          backgroundColor: "#ccc",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }} />
      )}

      {/* ⭐ para socios */}
      {paraSocios === 1 && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 20,
            padding: 4,
          }}
        >
          <IoStar size={18} color="#FFD700" />
        </div>
      )}

      <p
        style={{
          padding: 8,
          fontWeight: 600,
          textAlign: "center",
          color: theme.text.secondary,
          margin: 0,
          fontSize: "14px",
          lineHeight: "1.3",
          minHeight: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {title}
      </p>
    </div>
  );
}
