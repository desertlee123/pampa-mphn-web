// src/context/NotificationProvider.js
"use client"

import { useEffect, useRef } from "react";
import { showToast } from "nextjs-toast-notify";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../services/api";

export default function NotificationProvider({ children }) {
  const { session } = useAuth();
  const lastCount = useRef(0);

  useEffect(() => {
    if (!session?.token || session.role !== "admin") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/comentarios/buscar?estado=revision`,
          {
            headers: { Authorization: `Bearer ${session.token}` },
          }
        );

        const data = await res.json();
        const count = data?.comentarios?.length ?? 0;

        // Si hay nuevos comentarios
        if (count > lastCount.current) {
          const nuevos = count - lastCount.current;

          showToast.success(
            nuevos === 1
              ? "¡Nuevo comentario en revisión!"
              : `¡${nuevos} nuevos comentarios en revisión!`,
            {
              duration: 4000,
              position: "top-right",
              transition: "bounceIn",
              sound: true,
            }
          );
        }

        lastCount.current = count;
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [session]);

  return <>{children}</>;
}
