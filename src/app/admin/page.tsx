"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { apiService } from "@/lib/api";
import {
  Calendar,
  Users,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  XCircle,
  Database,
  Activity,
  BarChart3,
  X,
} from "lucide-react";

interface AdminStats {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  total_advisors: number;
  available_slots: number;
  booked_slots: number;
  blocked_slots: number;
  pending_emails: number;
  sent_emails: number;
  failed_emails: number;
}

interface RecentBooking {
  id: number;
  client_name: string;
  advisor_name: string;
  start_utc: string;
  end_utc: string;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resendingEmails, setResendingEmails] = useState<Set<number>>(
    new Set()
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar estadísticas
      const statsData = await apiService.getAdminStats();
      setStats(statsData);

      // Cargar reservas recientes (últimas 5)
      const allBookings = await apiService.getAdminBookings();

      const recentBookings = allBookings
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);
      setRecentBookings(recentBookings);
    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (bookingId: number) => {
    try {
      // Agregar a la lista de emails siendo reenviados
      setResendingEmails((prev) => new Set(prev).add(bookingId));

      await apiService.resendEmail(bookingId);

      // Mostrar mensaje de éxito
      setToast({ message: "Email reenviado exitosamente", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      console.error("Error resending email:", error);
      setToast({ message: "Error al reenviar el email", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      // Remover de la lista de emails siendo reenviados
      setResendingEmails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "completed":
        return <Badge variant="info">Completada</Badge>;
      default:
        return <Badge variant="warning">Pendiente</Badge>;
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "N/A";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">
                      Resumen general del sistema de reservas
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={loadDashboardData}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-2xl font-semibold"
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                Actualizar Datos
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Reservas */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                      Total Reservas
                    </p>
                    <p className="text-4xl font-bold text-blue-900 group-hover:scale-110 transition-transform duration-300">
                      {stats?.total_bookings || 0}
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Confirmadas */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-gradient-to-br from-green-50 via-green-100 to-green-200 border-green-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                      Confirmadas
                    </p>
                    <p className="text-4xl font-bold text-green-900 group-hover:scale-110 transition-transform duration-300">
                      {stats?.confirmed_bookings || 0}
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asesores */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 border-purple-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                      Asesores
                    </p>
                    <p className="text-4xl font-bold text-purple-900 group-hover:scale-110 transition-transform duration-300">
                      {stats?.total_advisors || 0}
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slots Ocupados */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border-orange-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                      Slots Ocupados
                    </p>
                    <p className="text-4xl font-bold text-orange-900 group-hover:scale-110 transition-transform duration-300">
                      {stats?.booked_slots || 0}
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emails */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Sistema de Emails
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Enviados
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.sent_emails || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Pendientes
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {stats?.pending_emails || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Fallidos
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {stats?.failed_emails || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slots */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Disponibilidad
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Disponibles
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.available_slots || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Ocupados
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats?.booked_slots || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Bloqueados
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {stats?.blocked_slots || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estados */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Estados</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Completadas
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.completed_bookings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Canceladas
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {stats?.cancelled_bookings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Confirmadas
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats?.confirmed_bookings || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
          <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Reservas Recientes
                    </h2>
                    <p className="text-sm text-gray-600">
                      Últimas 5 reservas del sistema
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 border-slate-300 text-slate-700 font-semibold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="group/item relative overflow-hidden bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">
                              {booking.client_name}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{booking.advisor_name}</span>
                            </p>
                            <p className="text-sm text-gray-500 flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDate(booking.start_utc)}{" "}
                                {formatTime(booking.start_utc)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusBadge(booking.status)}
                          </div>
                          <Button
                            size="sm"
                            className={`${
                              booking.status === "completed" ||
                              booking.status === "cancelled"
                                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105"
                            } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl font-semibold`}
                            onClick={() => handleResendEmail(booking.id)}
                            disabled={
                              resendingEmails.has(booking.id) ||
                              booking.status === "completed" ||
                              booking.status === "cancelled"
                            }
                          >
                            {resendingEmails.has(booking.id) ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Enviando...
                              </>
                            ) : booking.status === "completed" ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Completada
                              </>
                            ) : booking.status === "cancelled" ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancelada
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Reenviar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                    <div className="relative bg-white rounded-full p-6 shadow-lg">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No hay reservas recientes
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Las nuevas reservas aparecerán aquí automáticamente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ver Reservas */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-5 shadow-xl">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ver Todas las Reservas
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Gestiona todas las reservas del sistema
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 rounded-2xl font-bold text-lg"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Ver Reservas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Logs de Email */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-5 shadow-xl">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Logs de Email
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Revisa el historial de emails enviados
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/email-logs")}
                  className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-300 text-green-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 rounded-2xl text-lg"
                >
                  <Mail className="w-6 h-6 mr-3" />
                  Ver Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Gestionar Asesores */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-5 shadow-xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Gestionar Asesores
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Administra los asesores disponibles
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-300 text-purple-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 rounded-2xl text-lg"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Ver Asesores
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-5 duration-300">
            <div
              className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 backdrop-blur-sm border ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400"
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <span className="font-bold text-lg">{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="ml-4 text-white/80 hover:text-white hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
