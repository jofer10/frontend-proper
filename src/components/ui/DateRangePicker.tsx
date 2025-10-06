import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Calendar, Search } from "lucide-react";
import { getCurrentDate, getDateInDays } from "@/lib/utils";

interface DateRangePickerProps {
  onRangeSelect: (from: string, to: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  initialFromDate?: string;
  initialToDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onRangeSelect,
  onSearch,
  isLoading = false,
  initialFromDate,
  initialToDate,
}) => {
  const [fromDate, setFromDate] = useState(initialFromDate || getCurrentDate());
  const [toDate, setToDate] = useState(initialToDate || getDateInDays(7));

  // Actualizar estado cuando cambien las props iniciales
  React.useEffect(() => {
    if (initialFromDate && initialToDate) {
      setFromDate(initialFromDate);
      setToDate(initialToDate);
    }
  }, [initialFromDate, initialToDate]);

  // Llamar a onRangeSelect cuando se inicializa
  React.useEffect(() => {
    onRangeSelect(fromDate, toDate);
  }, [fromDate, toDate]);

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromDate(value);

    // Si la fecha de inicio es mayor que la fecha fin, ajustar la fecha fin
    if (value > toDate) {
      const newToDate = new Date(value);
      newToDate.setDate(newToDate.getDate() + 7);
      const newToDateStr = newToDate.toISOString().split("T")[0];
      setToDate(newToDateStr);
      onRangeSelect(value, newToDateStr);
    } else {
      onRangeSelect(value, toDate);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToDate(value);
    onRangeSelect(fromDate, value);
  };

  const handleQuickRange = (days: number) => {
    const today = getCurrentDate();
    const endDate = getDateInDays(days);
    setFromDate(today);
    setToDate(endDate);
    onRangeSelect(today, endDate);
  };

  // Verificar si el rango actual coincide con algún rango rápido
  const isQuickRange = (days: number) => {
    const today = getCurrentDate();
    const expectedEndDate = getDateInDays(days);
    return fromDate === today && toDate === expectedEndDate;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Selecciona Rango de Fechas
            </h3>
            <p className="text-gray-600 text-sm">
              Elige el período para buscar disponibilidad
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rango rápido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango rápido
          </label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRange(7)}
              className={isQuickRange(7) ? "bg-blue-50 border-blue-300" : ""}
            >
              Próximos 7 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRange(14)}
              className={isQuickRange(14) ? "bg-blue-50 border-blue-300" : ""}
            >
              Próximos 14 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRange(30)}
              className={isQuickRange(30) ? "bg-blue-50 border-blue-300" : ""}
            >
              Próximos 30 días
            </Button>
          </div>
        </div>

        {/* Selector de fechas personalizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de inicio"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            min={getCurrentDate()}
            max={getDateInDays(30)}
          />

          <Input
            label="Fecha de fin"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            min={fromDate}
            max={getDateInDays(30)}
          />
        </div>

        {/* Botón de búsqueda */}
        <div className="pt-4">
          <Button
            onClick={onSearch}
            isLoading={isLoading}
            className="w-full"
            disabled={!fromDate || !toDate || fromDate > toDate}
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Buscando..." : "Buscar Disponibilidad"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangePicker;
