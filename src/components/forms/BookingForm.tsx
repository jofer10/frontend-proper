import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Advisor, TimeSlot, BookingFormData } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Calendar, Clock, CheckCircle } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

// Esquema de validación
const bookingSchema = z.object({
  client_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  client_email: z
    .string()
    .email("Ingresa un email válido")
    .min(1, "El email es requerido"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  advisor: Advisor;
  timeSlot: TimeSlot;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  advisor,
  timeSlot,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: BookingFormValues) => {
    const bookingData: BookingFormData = {
      slot_id: timeSlot.id,
      client_name: data.client_name,
      client_email: data.client_email,
    };

    try {
      await onSubmit(bookingData);
      reset();
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Confirmar Reserva
            </h2>
            <p className="text-gray-600 text-sm">
              Completa tus datos para finalizar la reserva
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumen de la reserva */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">
            Resumen de tu reserva
          </h3>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Asesor</p>
              <p className="font-medium text-gray-900">{advisor.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-medium text-gray-900">
                {formatDate(timeSlot.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Hora</p>
              <p className="font-medium text-gray-900">
                {formatTime(timeSlot.start_time)}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Ingresa tu nombre completo"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.client_name?.message}
            {...register("client_name")}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.client_email?.message}
            helperText="Te enviaremos la confirmación a este email"
            {...register("client_email")}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Procesando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">¿Qué pasa después?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Recibirás un email de confirmación</li>
            <li>• Te enviaremos un recordatorio 24h antes</li>
            <li>• Podrás cancelar hasta 2 horas antes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
