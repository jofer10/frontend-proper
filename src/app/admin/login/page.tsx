"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  UserPlus,
  LogIn,
} from "lucide-react";

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Mostrar el mensaje específico de la base de datos
        setError(data.error || data.message || "Credenciales inválidas");

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
        return;
      }

      localStorage.setItem("admin_token", data.data.token);
      router.push("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      // Si es un error de red o parsing, mostrar mensaje genérico
      if (error.message && error.message.includes("fetch")) {
        setError(
          "Error de conexión. Por favor, verifica tu conexión a internet."
        );

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
      } else {
        setError(
          error.message ||
            "Credenciales inválidas. Por favor, verifica tus datos."
        );

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
        }/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Mostrar el mensaje específico de la base de datos
        setError(data.error || data.message || "Error al crear la cuenta");

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
        return;
      }

      setSuccess("Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
      setIsLogin(true);
      setEmail("");
      setPassword("");

      // Auto-cerrar mensaje de éxito después de 10 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 10000);
    } catch (error: any) {
      console.error("Register error:", error);
      // Si es un error de red o parsing, mostrar mensaje genérico
      if (error.message && error.message.includes("fetch")) {
        setError(
          "Error de conexión. Por favor, verifica tu conexión a internet."
        );

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
      } else {
        setError(
          error.message ||
            "Error al crear la cuenta. Por favor, intenta nuevamente."
        );

        // Auto-cerrar mensaje de error después de 10 segundos
        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <style jsx>{`
        input[type="password"]::-webkit-textfield-decoration-container {
          display: none !important;
        }
        input[type="password"]::-webkit-credentials-auto-fill-button {
          display: none !important;
        }
        input[type="password"]::-webkit-caps-lock-indicator {
          display: none !important;
        }
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
        }
        input[type="password"]::-webkit-credentials-auto-fill-button {
          display: none !important;
        }
        input[type="password"]::-ms-reveal {
          display: none !important;
        }
        input[type="password"]::-ms-clear {
          display: none !important;
        }

        .card-flip {
          transform-style: preserve-3d;
          transition: transform 0.7s ease-in-out;
        }

        .card-flip.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          min-height: 40rem;
        }

        .card-front {
          transform: rotateY(0deg);
        }

        .card-back {
          transform: rotateY(180deg);
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xl text-blue-100 font-medium">
              Sistema de Gestión de Reservas
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">
                Sistema Activo
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
              <div className="flex">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isLogin
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    !isLogin
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registro</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Container with Flip Animation */}
          <div className="relative min-h-[40rem]">
            <div
              className={`card-flip ${!isLogin ? "flipped" : ""} w-full h-full`}
            >
              {/* Front Face - Login */}
              <div className="card-face card-front">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden h-full">
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Iniciar Sesión
                      </h2>
                      <p className="text-blue-100">
                        Accede al panel de administración
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 flex-1">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="login-email"
                          className="block text-sm font-semibold text-white/90"
                        >
                          Correo Electrónico
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                          </div>
                          <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@bookingapp.com"
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="login-password"
                          className="block text-sm font-semibold text-white/90"
                        >
                          Contraseña
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                          </div>
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                            style={
                              {
                                WebkitTextSecurity: showPassword
                                  ? "none"
                                  : "disc",
                                textSecurity: showPassword ? "none" : "disc",
                              } as React.CSSProperties
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-400 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Iniciando sesión...</span>
                          </>
                        ) : (
                          <>
                            <span>Acceder al Panel</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <h4 className="text-xs font-bold text-yellow-300 uppercase tracking-wide">
                          Credenciales de Demo
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-blue-300" />
                          <span className="text-white/90 font-medium text-sm">
                            admin@bookingapp.com
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Lock className="w-3 h-3 text-blue-300" />
                          <span className="text-white/90 font-medium text-sm">
                            admin123
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Face - Register */}
              <div className="card-face card-back">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden h-full">
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Crear Cuenta
                      </h2>
                      <p className="text-blue-100">
                        Crea una nueva cuenta de administrador
                      </p>
                    </div>

                    <form
                      onSubmit={handleRegister}
                      className="space-y-6 flex-1"
                    >
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="register-email"
                          className="block text-sm font-semibold text-white/90"
                        >
                          Correo Electrónico
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                          </div>
                          <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nuevo@admin.com"
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="register-password"
                          className="block text-sm font-semibold text-white/90"
                        >
                          Contraseña
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                          </div>
                          <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                            style={
                              {
                                WebkitTextSecurity: showPassword
                                  ? "none"
                                  : "disc",
                                textSecurity: showPassword ? "none" : "disc",
                              } as React.CSSProperties
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-400 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creando cuenta...</span>
                          </>
                        ) : (
                          <>
                            <span>Crear Cuenta</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Información de Registro */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h4 className="text-xs font-bold text-green-300 uppercase tracking-wide">
                          Información de Registro
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-3 h-3 text-green-300" />
                          <span className="text-white/90 font-medium text-sm">
                            Solo para desarrollo
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-3 h-3 text-green-300" />
                          <span className="text-white/90 font-medium text-sm">
                            Acceso completo al panel
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-blue-200 hover:text-white transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver al sitio principal</span>
            </a>
          </div>
        </div>

        {/* Floating Toast Messages */}
        {error && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-red-500/90 backdrop-blur-xl border border-red-400/50 text-red-100 px-6 py-4 rounded-2xl shadow-2xl max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-medium">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-300 hover:text-red-100 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-500/90 backdrop-blur-xl border border-green-400/50 text-green-100 px-6 py-4 rounded-2xl shadow-2xl max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">{success}</span>
                <button
                  onClick={() => setSuccess(null)}
                  className="ml-2 text-green-300 hover:text-green-100 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLoginPage;
