import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReservaCitas - Sistema de Reservas Profesional",
  description:
    "Reserva tus citas con nuestros asesores especializados de manera fácil y segura.",
  keywords: "reservas, citas, asesores, consultoría, agendar",
  authors: [{ name: "ReservaCitas Team" }],
  robots: "index, follow",
  openGraph: {
    title: "ReservaCitas - Sistema de Reservas Profesional",
    description:
      "Reserva tus citas con nuestros asesores especializados de manera fácil y segura.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReservaCitas - Sistema de Reservas Profesional",
    description:
      "Reserva tus citas con nuestros asesores especializados de manera fácil y segura.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  );
}
