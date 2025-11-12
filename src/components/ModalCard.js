// /src/components/ModalCard.js
"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalCard({ open, title, message, onConfirm, onCancel, confirmText = "Aceptar", cancelText = "Cancelar", theme }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              background: theme.cardBackground,
              color: theme.text.primary,
              borderRadius: 16,
              padding: 24,
              maxWidth: 360,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>{title}</h3>
            <p style={{ color: theme.text.secondary, marginBottom: 24 }}>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {onCancel && (
                <button
                  onClick={onCancel}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={onConfirm}
                style={{
                  background: theme.primary,
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
