import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";

interface AlertProps {
  type?: "error" | "success" | "info" | "warning";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={clsx(
        "border rounded-lg p-4 flex items-start space-x-3",
        getStyles(),
        className
      )}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        {title && <h3 className="font-medium text-sm mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
