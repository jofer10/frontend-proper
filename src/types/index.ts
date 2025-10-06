// Tipos para la aplicación de reservas

export interface Advisor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  description: string;
  avatar?: string;
}

export interface TimeSlot {
  id: number;
  advisor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Booking {
  id: number;
  advisor_id: number;
  advisor_name: string;
  client_name: string;
  client_email: string;
  date: string;
  start_time?: string;
  end_time?: string;
  status: "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  slot_id: number;
  client_name: string;
  client_email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface AvailabilityResponse {
  advisor: Advisor;
  slots: TimeSlot[];
}

export interface BookingResponse {
  booking_id: number;
  client_name: string;
  client_email: string;
  status: string;
  created_at: string;
}

export interface EmailLog {
  id: number;
  booking_id: number;
  type: "confirmation" | "reminder_24h" | "reminder_1h";
  status: "sent" | "pending" | "failed";
  attempts: number;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
  client_name: string;
  client_email: string;
  advisor_name: string;
}

export interface EmailLogsResponse {
  success: boolean;
  data: EmailLog[];
}
