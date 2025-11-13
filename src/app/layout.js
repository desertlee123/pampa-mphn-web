// src/app/layout.js
import "./globals.css";
import Providers from "../context/Providers";
import MainLayout from "../components/MainLayout";

export const metadata = {
  title: "PAMPA MPHN",
  description: "Pampa MPHN - Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
