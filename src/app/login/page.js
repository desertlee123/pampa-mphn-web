// src/app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { loginUser, visitorSession } from "../../services/authService";
import AuthHeader from "../../components/AuthHeader";
import AuthInputField from "../../components/AuthInputField";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) return setError("Completa todos los campos.");
    try {
      setLoading(true);
      const newSession = await loginUser(email, password);
      setSession(newSession);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitor = async () => {
    const s = await visitorSession();
    setSession(s);
    router.push("/");
  };

  return (
    <div style={getStyles(theme).container}>
      {/* Card principal */}
      <div style={getStyles(theme).card}>
        <AuthHeader />

        <AuthInputField
          label="Correo Electrónico"
          iconName="email"
          placeholder="nombre@gmail.com"
          value={email}
          onChange={setEmail}
          keyboardType="email-address"
        />

        <AuthInputField
          label="Contraseña"
          iconName="lock"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={setPassword}
          style={{ marginTop: 12, marginBottom: 20 }}
        />

        {error && (
          <div style={getStyles(theme).error}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={getStyles(theme).button}
        >
          <span style={getStyles(theme).buttonText}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </span>
        </button>

        {loading && (
          <div style={getStyles(theme).loadingContainer}>
            <div style={getStyles(theme).spinner} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Footer con registro y visitante */}
      <div style={getStyles(theme).footer}>
        <p style={getStyles(theme).footerText}>
          ¿No tenés una cuenta?{" "}
          <span
            style={getStyles(theme).link}
            onClick={() => router.push("/signin")}
          >
            Registrate
          </span>
        </p>

        <button
          onClick={handleVisitor}
          style={getStyles(theme).visitorButton}
        >
          Continuar como visitante
        </button>
      </div>
    </div>
  );
}

const getStyles = (theme) => ({
  container: {
    flex: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.background,
  },
  card: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    padding: "12px 0",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    opacity: 1,
    transition: "opacity 0.2s",
  },
  buttonText: {
    color: theme.button.text,
    fontWeight: "bold",
    fontSize: 16
  },
  loadingContainer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center"
  },
  spinner: {
    width: 20,
    height: 20,
    border: `2px solid ${theme.primary}`,
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  separatorBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "16px 0",
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border || "#ccc"
  },
  separatorText: {
    margin: "0 8px",
    color: theme.text.secondary
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
  },
  footerText: {
    color: theme.text.secondary,
    margin: 0,
    fontSize: 14,
  },
  link: {
    color: theme.primary,
    fontWeight: "bold",
    cursor: "pointer",
  },
  visitorButton: {
    background: "transparent",
    border: "none",
    color: theme.text.secondary,
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: 15,
    fontSize: 14,
    padding: 0,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    border: '1px solid #fecaca',
    background: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
  }
});
