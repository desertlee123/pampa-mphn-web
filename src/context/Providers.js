"use client";

import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
