import React, { useState, useEffect } from "react";
import { Advisor } from "@/types";
import { apiService } from "@/lib/api";
import AdvisorCard from "./AdvisorCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Users, AlertCircle } from "lucide-react";

interface AdvisorSelectionProps {
  onAdvisorSelect: (advisor: Advisor) => void;
  selectedAdvisor?: Advisor;
}

const AdvisorSelection: React.FC<AdvisorSelectionProps> = ({
  onAdvisorSelect,
  selectedAdvisor,
}) => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      loadAdvisors();
    }
  }, [hasLoaded]);

  const loadAdvisors = async () => {
    try {
      setLoading(true);
      setError(null);
      const advisorsData = await apiService.getAdvisors();
      setAdvisors(advisorsData);
      setHasLoaded(true);
    } catch (err) {
      setError("Error al cargar los asesores. Por favor, intenta de nuevo.");
      console.error("Error loading advisors:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando asesores disponibles...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar asesores
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAdvisors}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Intentar de nuevo
          </button>
        </CardContent>
      </Card>
    );
  }

  if (advisors.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay asesores disponibles
          </h3>
          <p className="text-gray-600">Por favor, intenta más tarde.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Selecciona tu Asesor
              </h2>
              <p className="text-gray-600 text-sm">
                Elige el profesional que mejor se adapte a tus necesidades
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {advisors.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            advisor={advisor}
            onSelect={onAdvisorSelect}
            isSelected={selectedAdvisor?.id === advisor.id}
          />
        ))}
      </div>

      {selectedAdvisor && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {(() => {
                  // Extraer la inicial del nombre real (sin Dr./Dra.)
                  const cleanName = selectedAdvisor.name
                    .replace(/^(Dr\.|Dra\.)\s*/i, "")
                    .trim();
                  return cleanName.charAt(0).toUpperCase();
                })()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Has seleccionado a {selectedAdvisor.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedAdvisor.specialty} • {selectedAdvisor.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvisorSelection;
