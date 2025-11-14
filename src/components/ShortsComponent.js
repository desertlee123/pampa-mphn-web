// /src/components/ShortsComponent.js
"use client";
import { useEffect, useRef, useState } from "react";
import ShortItem from "./ShortItem";

export default function ShortsComponent({ items }) {
  const containerRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll(".short-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
            const index = Number(entry.target.dataset.index);
            setVisibleIndex(index);
          }
        });
      },
      {
        threshold: [0.8],
        rootMargin: "0px"
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  // Manejar scroll con rueda del mouse y touch
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const scrollAmount = e.deltaY > 0 ? window.innerHeight : -window.innerHeight;
      container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    };

    // Prevenir scroll horizontal
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "calc(100vh - 130px)", // Resta header y tabbar
        width: "100%",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        backgroundColor: "black",
        marginTop: "0px", // Asegurar que no quede espacio extra
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          data-index={index}
          className="short-item"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            height: "calc(100vh - 130px)", // Misma altura que el contenedor
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          <ShortItem url={item.url} visible={index === visibleIndex} />
        </div>
      ))}
    </div>
  );
}
