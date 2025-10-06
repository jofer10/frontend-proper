import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates: string[];
  minDate?: string;
  maxDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const date = new Date(selectedDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const today = new Date();
  const minDateObj = minDate ? new Date(minDate) : today;
  const maxDateObj = maxDate
    ? new Date(maxDate)
    : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  const getWeekDays = () => {
    return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  };

  const isDateAvailable = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const dateString = date.toISOString().split("T")[0];

    return (
      date >= minDateObj &&
      date <= maxDateObj &&
      availableDates.includes(dateString)
    );
  };

  const isDateSelected = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const dateString = date.toISOString().split("T")[0];
    return dateString === selectedDate;
  };

  const isToday = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const todayString = today.toISOString().split("T")[0];
    const dateString = date.toISOString().split("T")[0];
    return dateString === todayString;
  };

  const handleDateClick = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const dateString = date.toISOString().split("T")[0];

    if (isDateAvailable(day, month)) {
      onDateSelect(dateString);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={currentMonth <= minDateObj}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="font-semibold text-gray-900 capitalize">
          {getMonthName(currentMonth)}
        </h3>

        <button
          onClick={goToNextMonth}
          disabled={currentMonth >= maxDateObj}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {getWeekDays().map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-10" />;
          }

          const isAvailable = isDateAvailable(day, currentMonth);
          const isSelected = isDateSelected(day, currentMonth);
          const isTodayDate = isToday(day, currentMonth);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day, currentMonth)}
              disabled={!isAvailable}
              className={cn(
                "h-10 w-10 rounded-lg text-sm font-medium transition-all",
                "hover:bg-gray-100 disabled:cursor-not-allowed",
                isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                !isSelected && isAvailable && "text-gray-900 hover:bg-gray-100",
                !isAvailable && "text-gray-300 cursor-not-allowed",
                isTodayDate &&
                  !isSelected &&
                  "bg-blue-50 text-blue-600 font-semibold"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
