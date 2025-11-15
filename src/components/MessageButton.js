// src/components/MessageButton.js
import { messageIcon } from "./Icons";

export default function MessageButton({ onClick, theme }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: theme.primary,
        borderRadius: "50%",
        position: 'fixed',
        padding: 16,
        right: 14,
        bottom: 14,
        border: "none",
        cursor: "pointer",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 100,
        marginBottom: "60px",
      }}
    >
      {messageIcon({ color: theme.background })}
    </button>
  );
}
