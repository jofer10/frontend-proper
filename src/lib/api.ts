import axios from "axios";
import {
  Advisor,
  TimeSlot,
  Booking,
  BookingFormData,
  ApiResponse,
  AvailabilityResponse,
  BookingResponse,
  EmailLog,
  EmailLogsResponse,
} from "@/types";

// Configuración base de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de la API
export const apiService = {
  // Obtener todos los asesores
  getAdvisors: async (): Promise<Advisor[]> => {
    const response = await api.get<ApiResponse<Advisor[]>>(
      "/bookings/advisors"
    );
    return response.data.data || [];
  },

  // Obtener disponibilidad de un asesor
  getAvailability: async (
    advisorId: number,
    fromDate: string,
    toDate: string
  ): Promise<AvailabilityResponse> => {
    const response = await api.get<ApiResponse<any>>("/bookings/availability", {
      params: {
        advisor_id: advisorId,
        from: fromDate,
        to: toDate,
      },
    });

    // Transformar datos del backend al formato esperado por el frontend
    const backendData = response.data.data!;
    const transformedSlots = backendData.available_slots.map((slot: any) => {
      // Extraer fecha directamente del string UTC sin crear objeto Date
      const dateStr = slot.start_utc.split("T")[0]; // "2025-10-06T16:00:00" -> "2025-10-06"

      // Extraer hora directamente del string UTC
      const timeStr = slot.start_utc
        .split("T")[1]
        .split(":")
        .slice(0, 2)
        .join(":"); // "16:00:00" -> "16:00"
      const endTimeStr = slot.end_utc
        .split("T")[1]
        .split(":")
        .slice(0, 2)
        .join(":"); // "17:00:00" -> "17:00"

      return {
        id: slot.id,
        advisor_id: advisorId,
        date: dateStr,
        start_time: timeStr,
        end_time: endTimeStr,
        is_available: slot.status === "free",
      };
    });

    return {
      advisor: {
        id: backendData.id,
        name: backendData.name,
        email: "", // No disponible en el backend
        specialty: "", // No disponible en el backend
        description: "", // No disponible en el backend
      },
      slots: transformedSlots,
    };
  },

  // Crear una reserva
  createBooking: async (
    bookingData: BookingFormData
  ): Promise<BookingResponse> => {
    const response = await api.post<ApiResponse<BookingResponse>>(
      "/bookings",
      bookingData
    );
    return response.data.data!;
  },

  // Obtener reservas de un cliente
  getClientBookings: async (email: string): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<any[]>>(
      "/bookings/my-bookings",
      {
        params: { email },
      }
    );

    // Transformar datos del backend al formato esperado por el frontend
    const backendData = response.data.data || [];
    const transformedBookings = backendData.map((booking: any) => {
      // Extraer fecha y hora de start_utc y end_utc
      const startDate = booking.start_utc
        ? booking.start_utc.split("T")[0]
        : "";
      const startTime = booking.start_utc
        ? booking.start_utc.split("T")[1].split(":").slice(0, 2).join(":")
        : "";
      const endTime = booking.end_utc
        ? booking.end_utc.split("T")[1].split(":").slice(0, 2).join(":")
        : "";

      return {
        id: booking.id,
        advisor_id: 0, // No disponible en el backend
        advisor_name: booking.advisor_name,
        client_name: booking.client_name,
        client_email: booking.client_email,
        date: startDate,
        start_time: startTime,
        end_time: endTime,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.created_at, // Usar created_at como updated_at
      };
    });

    return transformedBookings;
  },

  // Verificar token (para admin)
  verifyToken: async (token: string): Promise<any> => {
    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Login de administrador
  adminLogin: async (email: string, password: string): Promise<any> => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data.data;
  },

  // Obtener estadísticas del admin
  getAdminStats: async (): Promise<any> => {
    const token = localStorage.getItem("admin_token");
    const response = await api.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Obtener todas las reservas (admin)
  getAdminBookings: async (): Promise<any[]> => {
    const token = localStorage.getItem("admin_token");
    const response = await api.get("/admin/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data || [];
  },

  // Buscar reservas con filtros (admin)
  searchAdminBookings: async (filters: {
    status?: string;
    advisor_id?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<any[]> => {
    const token = localStorage.getItem("admin_token");
    const params: any = {};

    if (filters.status && filters.status !== "all")
      params.status = filters.status;
    if (filters.advisor_id && filters.advisor_id !== "all")
      params.advisor_id = filters.advisor_id;
    if (filters.from_date) params.from_date = filters.from_date;
    if (filters.to_date) params.to_date = filters.to_date;

    const response = await api.get("/admin/bookings", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data.data || [];
  },

  // Reenviar email de confirmación
  resendEmail: async (bookingId: number): Promise<any> => {
    const token = localStorage.getItem("admin_token");
    const response = await api.post(
      `/admin/bookings/${bookingId}/resend-email`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Cambiar estado de reserva
  updateBookingStatus: async (
    bookingId: number,
    status: string
  ): Promise<any> => {
    const token = localStorage.getItem("admin_token");
    const response = await api.put(
      `/admin/bookings/${bookingId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Cancelar reserva (DELETE)
  cancelBooking: async (bookingId: number): Promise<any> => {
    const token = localStorage.getItem("admin_token");
    const response = await api.delete(`/admin/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener logs de email (admin)
  getEmailLogs: async (type?: string, status?: string): Promise<EmailLog[]> => {
    const token = localStorage.getItem("admin_token");
    const params: any = {};
    if (type) params.type = type;
    if (status) params.status = status;

    const response = await api.get<EmailLogsResponse>("/admin/email-logs", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data.data || [];
  },
};

export default api;
