// src/app/layout.js
import "./globals.css";
import Providers from "../context/Providers";

export const metadata = {
  title: "PAMPA MPHN",
  description: "Pampa MPHN - Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
