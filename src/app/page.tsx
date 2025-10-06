"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Advisor, TimeSlot, BookingFormData } from "@/types";
import { apiService } from "@/lib/api";
import AdvisorSelection from "@/components/booking/AdvisorSelection";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import BookingForm from "@/components/forms/BookingForm";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Shield,
  Mail,
  Phone,
} from "lucide-react";

type BookingStep = "advisor" | "time" | "form" | "confirmation";

export default function HomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<BookingStep>("advisor");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdvisorSelect = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setCurrentStep("time");
    setError(null); // Limpiar errores al cambiar de paso
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep("form");
    setError(null); // Limpiar errores al cambiar de paso
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      setError(null); // Limpiar errores previos
      const response = await apiService.createBooking(data);
      setBookingId(response.booking_id.toString());
      setCurrentStep("confirmation");
    } catch (error: any) {
      console.error("Error creating booking:", error);

      // Manejar error específico de slot no disponible
      if (error?.response?.data?.error?.includes("Slot no disponible")) {
        setError(
          "El horario elegido ya fue reservado por otro cliente. Por favor, selecciona otro horario."
        );
      } else {
        setError("Error al crear la reserva. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep("advisor");
    setSelectedAdvisor(null);
    setSelectedTimeSlot(null);
    setBookingId(null);
    setError(null);
  };

  const goBack = () => {
    if (currentStep === "time") {
      setCurrentStep("advisor");
    } else if (currentStep === "form") {
      setCurrentStep("time");
    }
    setError(null); // Limpiar errores al retroceder
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "advisor":
        return "Selecciona tu Asesor";
      case "time":
        return "Elige Fecha y Hora";
      case "form":
        return "Confirma tu Reserva";
      case "confirmation":
        return "¡Reserva Confirmada!";
      default:
        return "Reserva tu Cita";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "advisor":
        return "Elige el profesional que mejor se adapte a tus necesidades";
      case "time":
        return "Selecciona el horario que más te convenga";
      case "form":
        return "Completa tus datos para finalizar la reserva";
      case "confirmation":
        return "Tu reserva ha sido confirmada exitosamente";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ReservaCitas
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema de Reservas Profesional
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="info" size="sm">
                <Star className="w-3 h-3 mr-1" />
                Profesional
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Reserva tu Cita de Manera Fácil
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Conecta con nuestros asesores especializados y agenda tu consulta
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Asesores Expertos</h3>
              <p className="text-blue-100">
                Profesionales especializados en diferentes áreas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Horarios Flexibles</h3>
              <p className="text-blue-100">
                Disponibilidad que se adapta a tu agenda
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Seguro</h3>
              <p className="text-blue-100">
                Protección de datos y transacciones seguras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {["advisor", "time", "form", "confirmation"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step
                      ? "bg-blue-600 text-white"
                      : index <
                        ["advisor", "time", "form", "confirmation"].indexOf(
                          currentStep
                        )
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index <
                      ["advisor", "time", "form", "confirmation"].indexOf(
                        currentStep
                      )
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === "advisor" && (
            <AdvisorSelection
              onAdvisorSelect={handleAdvisorSelect}
              selectedAdvisor={selectedAdvisor || undefined}
            />
          )}

          {currentStep === "time" && selectedAdvisor && (
            <TimeSlotSelector
              advisor={selectedAdvisor}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedSlot={selectedTimeSlot || undefined}
            />
          )}

          {currentStep === "form" && selectedAdvisor && selectedTimeSlot && (
            <div className="space-y-6">
              <BookingForm
                advisor={selectedAdvisor}
                timeSlot={selectedTimeSlot}
                onSubmit={handleBookingSubmit}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {currentStep === "confirmation" && (
            <Card className="text-center">
              <CardContent className="p-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Reserva Confirmada!
                </h3>
                <p className="text-gray-600 mb-6">
                  Tu reserva ha sido procesada exitosamente. Recibirás un email
                  de confirmación.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetBooking} className="w-full sm:w-auto">
                    <Calendar className="w-4 h-4 mr-2" />
                    Hacer Otra Reserva
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/my-bookings")}
                    className="w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Ver Mis Reservas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {currentStep !== "confirmation" && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={currentStep === "advisor"}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep === "time" && selectedTimeSlot && (
                <Button onClick={() => setCurrentStep("form")}>
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ReservaCitas</h3>
              <p className="text-gray-400">
                Sistema profesional de reservas de citas con asesores
                especializados.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@reservacitas.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <div className="text-gray-400">
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReservaCitas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Notificación flotante de error */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-red-500/90 backdrop-blur-xl border border-red-400/50 text-red-100 px-6 py-4 rounded-2xl shadow-2xl max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-medium flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-300 hover:text-red-100 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
