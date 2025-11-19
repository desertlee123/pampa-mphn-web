// src/components/CarruselElement.js
/* eslint-disable @next/next/no-img-element */
"use client";

export default function CarruselElement({ title, imageUrl }) {
  return (
    <div
      style={{
        width: 380,
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.7)",
          padding: "10px 8px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
