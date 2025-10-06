import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fecha para mostrar
export function formatDate(date: string | Date | undefined): string {
  if (!date) return "";

  // Si es string, extraer componentes directamente sin crear objeto Date
  if (typeof date === "string") {
    const [year, month, day] = date.split("-");
    const dateObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    return dateObj.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Formatear fecha completa
export function formatDateFull(date: string | Date | undefined): string {
  if (!date) return "";

  // Si es string, extraer componentes directamente sin crear objeto Date
  if (typeof date === "string") {
    const [year, month, day] = date.split("-");
    const dateObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    return dateObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Formatear hora para mostrar
export function formatTime(time: string | undefined): string {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Formatear fecha y hora juntas
export function formatDateTime(
  date: string | undefined,
  time: string | undefined
): string {
  if (!date) return "";
  if (!time) return formatDateFull(date);
  return `${formatDateFull(date)} a las ${formatTime(time)}`;
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generar ID único
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Obtener fecha actual en formato YYYY-MM-DD
export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

// Obtener fecha de mañana
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

// Obtener fecha en X días
export function getDateInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// Verificar si una fecha es hoy
export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
}

// Verificar si una fecha es mañana
export function isTomorrow(date: string): boolean {
  const tomorrow = getTomorrowDate();
  return date === tomorrow;
}

// Obtener días de la semana
export function getWeekDays(): string[] {
  return [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
}

// Obtener meses del año
export function getMonths(): string[] {
  return [
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
}
