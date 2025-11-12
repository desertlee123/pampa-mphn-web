// src/context/AuthContext.js

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "../services/storage";
import { validateSession } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión inicial desde storage
  useEffect(() => {
    const init = async () => {
      const stored = await getSession();
      if (stored) {
        const valid = await validateSession();
        if (valid) setSession(valid);
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
