import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Advisor } from "@/types";
import { User, Mail, Star, Calendar } from "lucide-react";

interface AdvisorCardProps {
  advisor: Advisor;
  onSelect: (advisor: Advisor) => void;
  isSelected?: boolean;
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({
  advisor,
  onSelect,
  isSelected = false,
}) => {
  // Extraer la inicial del nombre real (sin Dr./Dra.)
  const getInitial = (name: string) => {
    // Remover Dr. o Dra. del nombre
    const cleanName = name.replace(/^(Dr\.|Dra\.)\s*/i, "").trim();
    return cleanName.charAt(0).toUpperCase();
  };

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col ${
        isSelected ? "ring-2 ring-blue-500 shadow-xl" : "hover:shadow-lg"
      }`}
    >
      <CardContent className="p-8 sm:p-10 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center space-y-6 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
              {getInitial(advisor.name)}
            </div>
          </div>

          {/* Información del asesor */}
          <div className="w-full space-y-4 flex-1">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {advisor.name}
              </h3>
              <Badge variant="info" size="md" className="inline-flex">
                <Star className="w-4 h-4 mr-2" />
                Especialista
              </Badge>
            </div>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {advisor.description}
            </p>
          </div>
        </div>

        {/* Botón fijo en la parte inferior */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant={isSelected ? "secondary" : "primary"}
            size="lg"
            onClick={() => onSelect(advisor)}
            className="w-full py-3"
          >
            <Calendar className="w-5 h-5 mr-3" />
            {isSelected ? "Seleccionado" : "Seleccionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvisorCard;
