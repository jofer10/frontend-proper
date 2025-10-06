"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // No verificar autenticación en la página de login
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkAuth = async () => {
      // Si estamos en la página de login, no verificar autenticación
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Verificar token con el backend de forma silenciosa
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
          }/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Token inválido o expirado - limpiar y redirigir silenciosamente
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        if (!data.success) {
          // Token inválido - limpiar y redirigir silenciosamente
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        // Error de red o token inválido - limpiar y redirigir silenciosamente
        console.log("Auth check failed, redirecting to login");
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si estamos en la página de login, mostrar el contenido sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Admin Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Panel de Administración
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Sistema de Reservas
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    localStorage.removeItem("admin_token");
                    router.push("/admin/login");
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-3xl blur-lg"></div>
        <div className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2 py-4">
              <a
                href="/admin"
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  pathname === "/admin"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                    : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                Dashboard
              </a>
              <a
                href="/admin/bookings"
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  pathname === "/admin/bookings"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                    : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                Reservas
              </a>
              <a
                href="/admin/email-logs"
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  pathname === "/admin/email-logs"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                    : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Logs de Email
              </a>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden py-4">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="/admin"
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                    pathname === "/admin"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                      : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  <span className="text-xs">Dashboard</span>
                </a>
                <a
                  href="/admin/bookings"
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                    pathname === "/admin/bookings"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                      : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                  <span className="text-xs">Reservas</span>
                </a>
                <a
                  href="/admin/email-logs"
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                    pathname === "/admin/email-logs"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                      : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="text-xs">Logs</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
