"use client";

import React, { useEffect, useState, useRef } from "react";
import { apiService } from "@/lib/api";
import { EmailLog } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Send,
  AlertCircle,
} from "lucide-react";

const EmailLogsPage: React.FC = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    status: "",
  });
  const tableRef = useRef<HTMLDivElement>(null);

  const loadEmailLogs = async (customFilters?: {
    type: string;
    status: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const filtersToUse = customFilters || appliedFilters;
      const logs = await apiService.getEmailLogs(
        filtersToUse.type || undefined,
        filtersToUse.status || undefined
      );
      setEmailLogs(logs);

      // Hacer scroll hacia la tabla después de cargar los logs
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (err) {
      console.error("Error loading email logs:", err);
      setError("Error al cargar los logs de email");
    } finally {
      setLoading(false);
    }
  };

  // Cargar logs automáticamente al montar el componente
  useEffect(() => {
    loadEmailLogs();
  }, []);

  // Función para aplicar filtros
  const applyFilters = async () => {
    const newAppliedFilters = { ...filters };
    setAppliedFilters(newAppliedFilters);
    // Cargar logs con los nuevos filtros aplicados directamente
    await loadEmailLogs(newAppliedFilters);
  };

  // Función para limpiar filtros
  const clearFilters = async () => {
    const emptyFilters = { type: "", status: "" };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    // Recargar logs sin filtros
    await loadEmailLogs(emptyFilters);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "bg-blue-100 text-blue-800";
      case "reminder_24h":
        return "bg-purple-100 text-purple-800";
      case "reminder_1h":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "confirmation":
        return "Confirmación";
      case "reminder_24h":
        return "Recordatorio 24h";
      case "reminder_1h":
        return "Recordatorio 1h";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviado";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-xl font-semibold">
            Cargando logs de email...
          </p>
        </div>
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
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Logs de Email
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">
                      Historial de todos los emails enviados por el sistema
                    </p>
                  </div>
                </div>
              </div>
              {/* <Button
                onClick={() => loadEmailLogs(appliedFilters)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-2xl font-semibold"
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                Actualizar Datos
              </Button> */}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]">
              <XCircle className="h-5 w-5 text-white flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-white hover:text-red-200 transition-colors duration-200 flex-shrink-0"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
          <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Header de filtros */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl shadow-lg">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Filtros de Búsqueda
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Personaliza tu búsqueda de logs de email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filtros en una sola fila */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Tipo de Email */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Tipo de Email
                    </label>
                    <div className="relative">
                      <Send className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <select
                        value={filters.type}
                        onChange={(e) =>
                          setFilters({ ...filters, type: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <option value="">Todos los tipos</option>
                        <option value="confirmation">Confirmación</option>
                        <option value="reminder_24h">Recordatorio 24h</option>
                        <option value="reminder_1h">Recordatorio 1h</option>
                      </select>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Estado
                    </label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <option value="">Todos los estados</option>
                        <option value="sent">Enviado</option>
                        <option value="pending">Pendiente</option>
                        <option value="failed">Fallido</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón Buscar */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Acción
                    </label>
                    <Button
                      onClick={applyFilters}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold text-lg"
                    >
                      <Search className="w-6 h-6" />
                      Buscar
                    </Button>
                  </div>

                  {/* Botón Limpiar */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Limpiar
                    </label>
                    <Button
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold text-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="10" y="2" width="4" height="12" rx="2" />
                        <rect x="6" y="14" width="12" height="3" rx="1" />
                        <path d="M7 17h2v2H7v-2z" />
                        <path d="M9 17h2v2H9v-2z" />
                        <path d="M11 17h2v2h-2v-2z" />
                        <path d="M13 17h2v2h-2v-2z" />
                        <path d="M15 17h2v2h-2v-2z" />
                        <circle cx="4" cy="16" r="0.5" opacity="0.6" />
                        <circle cx="5" cy="18" r="0.4" opacity="0.5" />
                        <circle cx="3" cy="19" r="0.3" opacity="0.4" />
                      </svg>
                      Limpiar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Logs Table */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
          <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <CardContent className="p-0">
              {emailLogs.length === 0 ? (
                <div className="p-16 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="relative mx-auto w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-6 shadow-2xl">
                      <Mail className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    No hay logs de email
                  </h3>
                  <p className="text-gray-600 text-xl max-w-md mx-auto">
                    No se encontraron logs de email con los filtros aplicados
                  </p>
                </div>
              ) : (
                <div>
                  {/* Header de resultados */}
                  <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            Resultados de Búsqueda
                          </h3>
                          <p className="text-lg text-gray-600 font-semibold">
                            {emailLogs.length} log
                            {emailLogs.length !== 1 ? "s" : ""} de email
                            encontrado{emailLogs.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabla con scroll */}
                  <div
                    ref={tableRef}
                    className="overflow-x-auto max-h-[32rem] overflow-y-auto"
                  >
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 sticky top-0 z-10 shadow-lg">
                        <tr>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Asesor
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Fecha de Envío
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Creado
                          </th>
                          <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {emailLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                          >
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      #{log.id}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {log.client_name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-gray-900">
                                    {log.client_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {log.client_email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">
                                {log.advisor_name}
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <Badge className={getTypeBadgeColor(log.type)}>
                                {getTypeLabel(log.type)}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <Badge
                                className={getStatusBadgeColor(log.status)}
                              >
                                {getStatusLabel(log.status)}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(log.sent_at)}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(log.created_at)}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                              {log.error_message ? (
                                <div className="flex items-center text-red-600">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  <span title={log.error_message}>Error</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span>OK</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailLogsPage;
