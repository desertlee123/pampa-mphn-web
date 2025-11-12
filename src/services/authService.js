import { API_BASE_URL } from "./api";
import { saveSession, getSession, clearSession } from "./storage";

async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) throw new Error(data.message || "Credenciales incorrectas");

  const session = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    token: data.token,
  };

  await saveSession(session);
  return session;
}

async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    const errMsg = (data && (data.message || JSON.stringify(data.errors))) || "Error al registrarse";
    throw new Error(errMsg);
  }

  const session = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    token: data.token,
  };

  await saveSession(session);
  return session;
}

export async function visitorSession() {
  const session = {
    token: "VISITOR_MODE",
    role: "visitor",
    email: "visitante@demo",
  };
  await saveSession(session);
  return session;
}

// Función de Cierre de Sesión (Logout)
async function logoutUser() {
  // clearSession(false) mantiene la última sesión (LAST_SESSION) para un posible re-login
  await clearSession(false);
}

export async function validateSession() {
  const session = await getSession();
  if (!session || !session.token || session.token === "VISITOR_MODE") return session;

  try {
    const res = await fetch(`${API_BASE_URL}/validate-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!res.ok) {
      await clearSession(true); // Borra la sesión y la última sesión guardada
      return null;
    }

    const data = await res.json();
    const updatedSession = { ...session, role: data.user?.role || session.role };
    await saveSession(updatedSession);
    return updatedSession;
  } catch (err) {
    console.warn("Error validando token:", err);
    // En caso de error de red, devolvemos la sesión existente para no desloguear
    // si el token es probablemente válido.
    return session;
  }
}

export { loginUser, registerUser, logoutUser };
