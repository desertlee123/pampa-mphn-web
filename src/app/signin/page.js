// src/app/signin/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { registerUser } from "../../services/authService";
import AuthHeader from "../../components/AuthHeader";
import AuthInputField from "../../components/AuthInputField";

export default function SigninPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignin = async () => {
    setErrors({});

    if (!name || !email || !password) {
      setErrors({ general: "Completa todos los campos." });
      return;
    }

    try {
      setLoading(true);
      const newSession = await registerUser(name, email, password);
      setSession(newSession);
      router.push("/");
    } catch (err) {
      console.log("Error original:", err.message);

      // Extraemos solo la parte JSON del mensaje de error
      let errorData = {};
      if (typeof err.message === 'string') {
        try {
          // Buscamos el JSON dentro del string del error
          const jsonMatch = err.message.match(/\{.*\}/);
          if (jsonMatch) {
            errorData = JSON.parse(jsonMatch[0]);
          }
        } catch {
          console.log("No se pudo parsear el error como JSON");
        }
      }

      console.log("Error data parseado:", errorData);

      // Traducimos los errores
      const translatedErrors = {};

      if (errorData.email && Array.isArray(errorData.email)) {
        const emailError = errorData.email[0];
        if (emailError.includes("already been taken")) {
          translatedErrors.email = "Este correo ya está registrado";
        } else if (emailError.includes("valid email")) {
          translatedErrors.email = "Debes ingresar un correo válido";
        }
      }

      if (errorData.password && Array.isArray(errorData.password)) {
        const passwordError = errorData.password[0];
        if (passwordError.includes("at least 8 characters")) {
          translatedErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }
      }

      console.log("Errores traducidos:", translatedErrors);

      // Si no pudimos traducir, mostramos error general
      if (Object.keys(translatedErrors).length === 0) {
        setErrors({ general: "Error al registrarse. Intenta nuevamente." });
      } else {
        setErrors(translatedErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={getStyles(theme).container}>
      <div style={getStyles(theme).contentWrapper}>
        <AuthHeader />

        <div style={getStyles(theme).card}>
          <AuthInputField
            label="Nombre de usuario"
            iconName="person"
            placeholder="Tu nombre"
            value={name}
            onChange={setName}
            hasError={!!errors.name}
          />

          <AuthInputField
            label="Correo Electrónico"
            iconName="email"
            placeholder="nombre@gmail.com"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
            hasError={!!errors.email}
          />

          {errors.email && (
            <div style={getStyles(theme).fieldError}>
              {errors.email}
            </div>
          )}

          <AuthInputField
            label="Contraseña"
            iconName="lock"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            type="password"
            style={{ marginBottom: 20 }}
            hasError={!!errors.password}
          />

          {errors.password && (
            <div style={getStyles(theme).fieldError}>
              {errors.password}
            </div>
          )}

          {errors.general && (
            <div style={getStyles(theme).error}>
              {errors.general}
            </div>
          )}

          <button
            onClick={handleSignin}
            disabled={loading}
            style={getStyles(theme).button}
          >
            <span style={getStyles(theme).buttonText}>
              {loading ? "Cargando..." : "Registrarse"}
            </span>
          </button>

          {loading && (
            <div style={getStyles(theme).loadingContainer}>
              <div style={getStyles(theme).spinner} />
            </div>
          )}
        </div>

        <div style={getStyles(theme).footer}>
          <p style={getStyles(theme).footerText}>
            ¿Ya tenés una cuenta?{" "}
            <span
              style={getStyles(theme).link}
              onClick={() => router.push("/login")}
            >
              Iniciá sesión
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const getStyles = (theme) => ({
  container: {
    flexGrow: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.background,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    width: "100%",
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
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
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
  footer: {
    marginTop: 20,
    textAlign: "center",
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
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    border: '1px solid #fecaca',
    background: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
    fontWeight: 500,
  }
});
