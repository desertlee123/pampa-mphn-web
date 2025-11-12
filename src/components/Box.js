/* eslint-disable @next/next/no-img-element */
"use client";
import { IoStar } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

export default function Box({ title, imageUrl, paraSocios, esSocio, onClick }) {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        width: 160,
        backgroundColor: theme.cardBackground,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            height: 120,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            objectFit: "cover",
          }}
        />
      ) : (
        <div style={{ width: "100%", height: 120, backgroundColor: "#ccc" }} />
      )}

      {/* ⭐ para socios */}
      {esSocio && paraSocios === 1 && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "50%",
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
        }}
      >
        {title}
      </p>
    </div>
  );
}
