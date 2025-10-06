"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import { apiService } from "@/lib/api";
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Send,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminBooking {
  id: number;
  advisor_name: string;
  client_name: string;
  client_email: string;
  start_utc: string;
  end_utc: string;
  status: string;
  created_at: string;
}

interface Advisor {
  id: number;
  name: string;
}

interface CustomCalendarProps {
  dateRange: { start: string; end: string };
  onDateClick: (date: Date) => void;
  isDateInRange: (date: Date) => boolean;
  isDateStart: (date: Date) => boolean;
  isDateEnd: (date: Date) => boolean;
  onClose: () => void;
  onTodayClick: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  dateRange,
  onDateClick,
  isDateInRange,
  isDateStart,
  isDateEnd,
  onClose,
  onTodayClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["L", "M", "X", "J", "V", "S", "D"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convertir domingo=0 a lunes=0

    const days = [];

    // Días del mes anterior - CORREGIDO
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevDate = new Date(prevYear, prevMonth, day);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    onTodayClick();
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className="w-full">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>

        <h3 className="text-base font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => {
          const isToday = date.toDateString() === today.toDateString();
          const inRange = isDateInRange(date);
          const isStart = isDateStart(date);
          const isEnd = isDateEnd(date);

          return (
            <button
              key={index}
              onClick={() => {
                onDateClick(date);
              }}
              className={`
                w-8 h-8 text-xs rounded-lg transition-all duration-200
                ${
                  !isCurrentMonth
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${isToday ? "font-bold" : ""}
                ${inRange ? "bg-blue-100 text-blue-700" : ""}
                ${isStart ? "bg-blue-500 text-white font-bold" : ""}
                ${isEnd ? "bg-blue-500 text-white font-bold" : ""}
                ${isStart && isEnd ? "rounded-full" : ""}
                ${isStart && !isEnd ? "rounded-l-lg rounded-r-none" : ""}
                ${isEnd && !isStart ? "rounded-r-lg rounded-l-none" : ""}
                ${inRange && !isStart && !isEnd ? "rounded-none" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Hoy
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [advisorFilter, setAdvisorFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Forzar re-renderizado cuando cambie el dateRange
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [dateRange]);
  const [isResending, setIsResending] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAdvisors();
    // Cargar todas las reservas automáticamente al ingresar
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const bookings = await apiService.getAdminBookings();
      setBookings(bookings);
      setHasSearched(true);

      // Hacer scroll hacia la tabla después de cargar las reservas
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error: any) {
      console.error("Error loading bookings:", error);
      setError("Error al cargar las reservas");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCalendar && !target.closest(".calendar-container")) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const searchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const filters = {
        status: statusFilter,
        advisor_id: advisorFilter,
        from_date: dateRange.start,
        to_date: dateRange.end || dateRange.start,
      };

      const bookings = await apiService.searchAdminBookings(filters);
      setBookings(bookings);
      setHasSearched(true);

      // Hacer scroll hacia la tabla después de la búsqueda
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error: any) {
      console.error("Error searching bookings:", error);
      setError("Error al buscar las reservas");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdvisors = async () => {
    try {
      const advisors = await apiService.getAdvisors();
      setAdvisors(advisors);
    } catch (error) {
      console.error("Error loading advisors:", error);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setAdvisorFilter("all");
    setDateRange({ start: "", end: "" });
    setBookings([]);
    setHasSearched(false);
    setError(null);
    setSuccess(null);
    setShowCalendar(false);
  };

  // Funciones para el calendario personalizado
  const formatCalendarDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDisplayText = () => {
    if (dateRange.start && dateRange.end) {
      // Parsear las fechas manualmente para evitar problemas de zona horaria
      const startParts = dateRange.start.split("-");
      const endParts = dateRange.end.split("-");

      const startDate = new Date(
        parseInt(startParts[0]),
        parseInt(startParts[1]) - 1,
        parseInt(startParts[2])
      );
      const endDate = new Date(
        parseInt(endParts[0]),
        parseInt(endParts[1]) - 1,
        parseInt(endParts[2])
      );

      return `${formatCalendarDate(startDate)} - ${formatCalendarDate(
        endDate
      )}`;
    } else if (dateRange.start) {
      // Parsear la fecha de inicio manualmente
      const startParts = dateRange.start.split("-");
      const startDate = new Date(
        parseInt(startParts[0]),
        parseInt(startParts[1]) - 1,
        parseInt(startParts[2])
      );

      return `${formatCalendarDate(startDate)} - ...`;
    }
    return "Seleccionar rango de fechas";
  };

  const handleDateClick = (date: Date) => {
    // Crear una nueva fecha sin problemas de zona horaria
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const cleanDate = new Date(year, month, day);

    const dateStr = formatDateForAPI(cleanDate);

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      // Primera selección o reiniciar
      setDateRange({ start: dateStr, end: "" });
    } else if (dateRange.start && !dateRange.end) {
      // Segunda selección
      const startDate = new Date(dateRange.start);
      if (cleanDate < startDate) {
        // Si la fecha seleccionada es anterior, intercambiar
        setDateRange({ start: dateStr, end: dateRange.start });
      } else {
        // Si la fecha seleccionada es posterior, completar el rango
        setDateRange({ start: dateRange.start, end: dateStr });
      }
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    const todayStr = formatDateForAPI(today);

    // Si no hay rango seleccionado, establecer inicio y fin en el mismo día
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: todayStr, end: todayStr });
    } else if (dateRange.start && !dateRange.end) {
      // Si ya hay una fecha de inicio, completar el rango con hoy
      setDateRange({ start: dateRange.start, end: todayStr });
    }
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange.start) return false;

    // Crear fechas limpias para comparación
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const cleanDate = new Date(year, month, day);

    // Parsear la fecha del dateRange de la misma manera que en handleDateClick
    const startDateParts = dateRange.start.split("-");
    const startDate = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1,
      parseInt(startDateParts[2])
    );

    const endDate = dateRange.end
      ? (() => {
          const endDateParts = dateRange.end.split("-");
          return new Date(
            parseInt(endDateParts[0]),
            parseInt(endDateParts[1]) - 1,
            parseInt(endDateParts[2])
          );
        })()
      : null;

    if (endDate) {
      return cleanDate >= startDate && cleanDate <= endDate;
    } else {
      return cleanDate.toDateString() === startDate.toDateString();
    }
  };

  const isDateStart = (date: Date) => {
    if (!dateRange.start) return false;

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const cleanDate = new Date(year, month, day);

    // Parsear la fecha del dateRange de la misma manera que en handleDateClick
    const startDateParts = dateRange.start.split("-");
    const startDate = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1,
      parseInt(startDateParts[2])
    );

    const isStart = cleanDate.toDateString() === startDate.toDateString();

    return isStart;
  };

  const isDateEnd = (date: Date) => {
    if (!dateRange.end) return false;

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const cleanDate = new Date(year, month, day);

    // Parsear la fecha del dateRange de la misma manera que en handleDateClick
    const endDateParts = dateRange.end.split("-");
    const endDate = new Date(
      parseInt(endDateParts[0]),
      parseInt(endDateParts[1]) - 1,
      parseInt(endDateParts[2])
    );

    const isEnd = cleanDate.toDateString() === endDate.toDateString();

    return isEnd;
  };

  const handleResendEmail = async (bookingId: number) => {
    try {
      setIsResending(bookingId);
      setError(null);
      setSuccess(null);

      await apiService.resendEmail(bookingId);

      // Mostrar mensaje de éxito
      setSuccess("Email reenviado exitosamente");

      // Auto-ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error resending email:", error);
      setError("Error al reenviar el email");
      setSuccess(null);
    } finally {
      setIsResending(null);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);

      // Actualizar el estado local sin hacer nueva petición
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      setSuccess("Estado actualizado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating status:", error);
      setError("Error al actualizar el estado");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await apiService.cancelBooking(bookingId);

      // Actualizar el estado local sin hacer nueva petición
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      setSuccess("Reserva cancelada exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      setError("Error al cancelar la reserva");
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

  const formatDate = (utcString: string) => {
    if (!utcString) return "Fecha no disponible";

    try {
      const date = new Date(utcString);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const formatTime = (utcString: string) => {
    if (!utcString) return "Hora no disponible";

    try {
      const date = new Date(utcString);
      if (isNaN(date.getTime())) {
        return "Hora inválida";
      }
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      return "Hora inválida";
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
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Gestión de Reservas
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">
                      Administra y filtra las reservas del sistema
                    </p>
                  </div>
                </div>
              </div>
              {/* <Button
                onClick={searchBookings}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-2xl font-semibold"
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                Actualizar Datos
              </Button> */}
            </div>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]">
              <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{success}</span>
              <button
                onClick={() => setSuccess(null)}
                className="text-white hover:text-green-200 transition-colors duration-200 flex-shrink-0"
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
                        Personaliza tu búsqueda de reservas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filtros en una sola fila */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Asesor */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Asesor
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <select
                        value={advisorFilter}
                        onChange={(e) => setAdvisorFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <option value="all">Todos los asesores</option>
                        {advisors.map((advisor) => (
                          <option
                            key={advisor.id}
                            value={advisor.id.toString()}
                          >
                            {advisor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Rango de fechas */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Rango de Fechas
                    </label>
                    <div className="relative calendar-container">
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="w-5 h-5 text-blue-500" />
                        <button
                          onClick={() => {
                            setShowCalendar(!showCalendar);
                          }}
                          className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                        >
                          <span className="text-gray-700">
                            {getDisplayText()}
                          </span>
                        </button>
                        {(dateRange.start || dateRange.end) && (
                          <button
                            onClick={() => setDateRange({ start: "", end: "" })}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Limpiar fechas"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Calendario personalizado */}
                      {showCalendar && (
                        <div
                          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
                          onClick={() => setShowCalendar(false)}
                        >
                          <div
                            className="bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-[320px] max-w-[380px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CustomCalendar
                              dateRange={dateRange}
                              onDateClick={handleDateClick}
                              isDateInRange={isDateInRange}
                              isDateStart={isDateStart}
                              isDateEnd={isDateEnd}
                              onClose={() => setShowCalendar(false)}
                              onTodayClick={handleTodayClick}
                              key={forceUpdate}
                            />
                          </div>
                        </div>
                      )}
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
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="cancelled">Canceladas</option>
                        <option value="completed">Completadas</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200 w-full">
                  <button
                    onClick={searchBookings}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 font-bold text-lg whitespace-nowrap w-full sm:w-auto"
                    title="Buscar reservas"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Search className="w-6 h-6" />
                    )}
                    Buscar Reservas
                  </button>
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold text-lg whitespace-nowrap w-full sm:w-auto"
                    title="Limpiar filtros"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Mango de la escoba */}
                      <rect x="10" y="2" width="4" height="12" rx="2" />
                      {/* Cabeza de la escoba */}
                      <rect x="6" y="14" width="12" height="3" rx="1" />
                      {/* Cerdas de la escoba */}
                      <path d="M7 17h2v2H7v-2z" />
                      <path d="M9 17h2v2H9v-2z" />
                      <path d="M11 17h2v2h-2v-2z" />
                      <path d="M13 17h2v2h-2v-2z" />
                      <path d="M15 17h2v2h-2v-2z" />
                      {/* Efecto de limpieza - partículas */}
                      <circle cx="4" cy="16" r="0.5" opacity="0.6" />
                      <circle cx="5" cy="18" r="0.4" opacity="0.5" />
                      <circle cx="3" cy="19" r="0.3" opacity="0.4" />
                      {/* Efecto de limpieza - brillos */}
                      <path
                        d="M2 15l0.5 0.5-0.5 0.5-0.5-0.5 0.5-0.5z"
                        opacity="0.7"
                      />
                      <path
                        d="M4 13l0.5 0.5-0.5 0.5-0.5-0.5 0.5-0.5z"
                        opacity="0.6"
                      />
                      <path
                        d="M6 14l0.5 0.5-0.5 0.5-0.5-0.5 0.5-0.5z"
                        opacity="0.5"
                      />
                    </svg>
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <CardContent className="p-0">
                {!hasSearched ? (
                  <div className="p-16 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-6 shadow-2xl">
                        <Search className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Buscar Reservas
                    </h3>
                    <p className="text-gray-600 text-xl max-w-md mx-auto">
                      Usa los filtros arriba y haz clic en "Buscar" para ver las
                      reservas del sistema
                    </p>
                  </div>
                ) : bookings.length > 0 ? (
                  <div>
                    {/* Header de resultados */}
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              Resultados de Búsqueda
                            </h3>
                            <p className="text-lg text-gray-600 font-semibold">
                              {bookings.length} reserva
                              {bookings.length !== 1 ? "s" : ""} encontrada
                              {bookings.length !== 1 ? "s" : ""}
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
                              Cliente
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Fecha y Hora
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Asesor
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((booking, index) => (
                            <tr
                              key={booking.id}
                              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group hover:shadow-lg"
                            >
                              {/* Cliente */}
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-gray-900">
                                      {booking.client_name}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                      {booking.client_email}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Fecha y Hora */}
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-gray-900">
                                      {formatDate(booking.start_utc)}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                      {formatTime(booking.start_utc)} -{" "}
                                      {formatTime(booking.end_utc)}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Asesor */}
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {booking.advisor_name}
                                  </div>
                                </div>
                              </td>

                              {/* Estado */}
                              <td className="px-8 py-6 whitespace-nowrap">
                                {getStatusBadge(booking.status)}
                              </td>

                              {/* Acciones */}
                              <td className="px-8 py-6 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center space-x-3">
                                  {/* Reenviar Email */}
                                  <button
                                    onClick={() =>
                                      handleResendEmail(booking.id)
                                    }
                                    disabled={
                                      isResending === booking.id ||
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                    }
                                    className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                        : "text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                                    }`}
                                    title={
                                      booking.status === "completed"
                                        ? "No disponible para reservas completadas"
                                        : booking.status === "cancelled"
                                        ? "No disponible para reservas canceladas"
                                        : "Reenviar Email"
                                    }
                                  >
                                    {isResending === booking.id ? (
                                      <LoadingSpinner size="sm" />
                                    ) : (
                                      <Send className="w-5 h-5" />
                                    )}
                                  </button>

                                  {/* Marcar Completada */}
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        booking.id,
                                        "completed"
                                      )
                                    }
                                    disabled={
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                    }
                                    className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                        : "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                                    }`}
                                    title={
                                      booking.status === "completed"
                                        ? "Ya está completada"
                                        : booking.status === "cancelled"
                                        ? "No disponible para reservas canceladas"
                                        : "Marcar como Completada"
                                    }
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>

                                  {/* Cancelar */}
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                    }
                                    className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                                      booking.status === "completed" ||
                                      booking.status === "cancelled"
                                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                        : "text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                                    }`}
                                    title={
                                      booking.status === "completed"
                                        ? "No disponible para reservas completadas"
                                        : booking.status === "cancelled"
                                        ? "Ya está cancelada"
                                        : "Cancelar Reserva"
                                    }
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-20 blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-400 to-gray-500 rounded-full p-6 shadow-2xl">
                        <Calendar className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      No se encontraron reservas
                    </h3>
                    <p className="text-gray-600 text-xl max-w-md mx-auto">
                      {statusFilter !== "all" ||
                      advisorFilter !== "all" ||
                      dateRange.start
                        ? "Intenta ajustar los filtros de búsqueda para encontrar más resultados"
                        : "No hay reservas en el sistema en este momento"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
