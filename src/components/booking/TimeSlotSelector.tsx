import React, { useState, useEffect, useCallback } from "react";
import { TimeSlot, Advisor } from "@/types";
import { apiService } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DateRangePicker from "@/components/ui/DateRangePicker";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import {
  formatDate,
  formatTime,
  getCurrentDate,
  getDateInDays,
} from "@/lib/utils";

interface TimeSlotSelectorProps {
  advisor: Advisor;
  onTimeSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  advisor,
  onTimeSlotSelect,
  selectedSlot,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const loadAvailability = useCallback(async () => {
    if (!dateRange) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getAvailability(
        advisor.id,
        dateRange.from,
        dateRange.to
      );
      setSlots(response.slots);
      setHasLoaded(true);

      // Extraer fechas únicas disponibles
      const uniqueDates = [
        ...new Set(response.slots.map((slot) => slot.date)),
      ].sort();

      setAvailableDates(uniqueDates);

      // No seleccionar automáticamente, dejar que el usuario elija
      setSelectedDate("");
    } catch (err) {
      console.error("Error loading availability:", err);
      setError(
        "Error al cargar la disponibilidad. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }, [dateRange, advisor.id]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const getSlotsForDate = (date: string) => {
    // Temporalmente mostrar todos los slots de la fecha, no solo los disponibles
    const allSlotsForDate = slots.filter((slot) => slot.date === date);
    return allSlotsForDate;
  };

  // Función para verificar si un horario ya pasó
  const isTimeSlotPassed = (date: string, time: string) => {
    // Usar fecha local en lugar de UTC para evitar problemas de zona horaria
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const currentDate = `${year}-${month}-${day}`;

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    const isPassed =
      date < currentDate || (date === currentDate && time <= currentTime);

    return isPassed;
  };

  const groupSlotsByTime = (slots: TimeSlot[]) => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    slots.forEach((slot) => {
      if (!grouped[slot.start_time]) {
        grouped[slot.start_time] = [];
      }
      grouped[slot.start_time].push(slot);
    });
    return grouped;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleRangeSelect = useCallback((from: string, to: string) => {
    setDateRange({ from, to });
  }, []);

  const handleSearchAvailability = useCallback(() => {
    if (!dateRange) {
      setError("Por favor, selecciona un rango de fechas");
      return;
    }
    loadAvailability();
  }, [dateRange, advisor, loadAvailability]);

  const handleRetry = () => {
    setError(null);
    setHasLoaded(false);
    setSlots([]);
    setAvailableDates([]);
    setSelectedDate("");
    // No resetear dateRange para mantener el rango seleccionado
  };

  const handleStartOver = () => {
    setError(null);
    setHasLoaded(false);
    setSlots([]);
    setAvailableDates([]);
    setSelectedDate("");
    setDateRange(null); // Solo resetear cuando se quiera empezar de nuevo
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando disponibilidad...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Selecciona Fecha y Hora
                </h2>
                <p className="text-gray-600 text-sm">
                  Disponibilidad de {advisor.name}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mostrar DateRangePicker con el rango mantenido */}
        <DateRangePicker
          onRangeSelect={handleRangeSelect}
          onSearch={handleSearchAvailability}
          isLoading={loading}
          initialFromDate={dateRange?.from}
          initialToDate={dateRange?.to}
        />

        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar disponibilidad
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const slotsForDate = getSlotsForDate(selectedDate);
  const groupedSlots = groupSlotsByTime(slotsForDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Selecciona Fecha y Hora
              </h2>
              <p className="text-gray-600 text-sm">
                Disponibilidad de {advisor.name}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Selector de rango de fechas */}
      <DateRangePicker
        onRangeSelect={handleRangeSelect}
        onSearch={handleSearchAvailability}
        isLoading={loading}
        initialFromDate={dateRange?.from}
        initialToDate={dateRange?.to}
      />

      {/* Selector de fecha */}
      {hasLoaded && availableDates.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Selecciona una fecha
                </h3>
                <p className="text-sm text-gray-600">
                  Elige el día que mejor te convenga
                </p>
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="w-full p-4 pr-10 bg-white border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium shadow-sm hover:border-blue-300 appearance-none"
              >
                <option value="">Selecciona una fecha</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Horarios disponibles - Solo mostrar si hay una fecha válida seleccionada */}
      {hasLoaded &&
      selectedDate &&
      selectedDate !== "" &&
      slotsForDate.length > 0 ? (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Horarios disponibles
                </h3>
                <p className="text-sm text-gray-600">
                  Para el {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(groupedSlots).map(([time, timeSlots]) => {
                const isPassed = isTimeSlotPassed(selectedDate, time);
                const isAvailable = timeSlots[0]?.is_available;
                const isDisabled = isPassed || !isAvailable;

                // Solo considerar seleccionado si el slot pertenece a la fecha actual
                const isSelected =
                  selectedSlot?.start_time === time &&
                  selectedSlot?.date === selectedDate;

                return (
                  <Button
                    key={time}
                    variant={isSelected ? "primary" : "outline"}
                    onClick={() =>
                      !isDisabled && onTimeSlotSelect(timeSlots[0])
                    }
                    disabled={isDisabled}
                    className={`h-14 transition-all duration-200 relative ${
                      isDisabled
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform scale-105"
                        : "bg-white hover:bg-green-50 border-green-300 hover:border-green-400 text-gray-700 hover:text-green-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 mr-2 ${
                        isDisabled ? "text-gray-400" : ""
                      }`}
                    />
                    <span className="font-medium">{formatTime(time)}</span>
                    {isDisabled && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">×</span>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : hasLoaded && selectedDate && selectedDate !== "" ? (
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay horarios disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Para el {formatDate(selectedDate)}. Intenta con otra fecha.
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedDate("")}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Cambiar fecha
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {selectedSlot && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Horario seleccionado
                </h3>
                <p className="text-gray-600">
                  {formatDate(selectedSlot.date)} a las{" "}
                  <span className="font-medium text-blue-700">
                    {formatTime(selectedSlot.start_time)}
                  </span>
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeSlotSelector;
