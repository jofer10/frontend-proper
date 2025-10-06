"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { apiService } from "@/lib/api";
import { Booking } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate, formatTime, formatDateTime } from "@/lib/utils";

const MyBookingsPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Por favor, ingresa tu email");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getClientBookings(email.trim());
      setBookings(result);
      setHasSearched(true);
    } catch (err) {
      setError(
        "Error al cargar las reservas. Verifica tu email e intenta de nuevo."
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Mis Reservas
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Form */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Buscar mis reservas
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ingresa tu email para ver todas tus reservas
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {bookings.length > 0
                  ? `${bookings.length} reserva${
                      bookings.length !== 1 ? "s" : ""
                    } encontrada${bookings.length !== 1 ? "s" : ""}`
                  : "No se encontraron reservas"}
              </h3>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {booking.advisor_name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {formatDate(booking.date)}
                              {booking.start_time && booking.end_time && (
                                <>
                                  {" "}
                                  • {formatTime(booking.start_time)} -{" "}
                                  {formatTime(booking.end_time)}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 truncate">
                            {booking.client_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 truncate">
                            {booking.client_email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            Creada:{" "}
                            {formatDateTime(booking.created_at, undefined)}
                          </span>
                        </div>
                        <span className="text-xs">ID: #{booking.id}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    No tienes reservas
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    No se encontraron reservas para este email.
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full sm:w-auto"
                  >
                    Hacer una Reserva
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
