import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: "up" | "down" | "na";
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
  const iconSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  switch (status) {
    case "up":
      return (
        <div className="flex items-center justify-center">
          <CheckCircle className={`${iconSize} text-green-500`} />
        </div>
      );
    case "down":
      return (
        <div className="flex items-center justify-center">
          <XCircle className={`${iconSize} text-red-500`} />
        </div>
      );
    case "na":
      return (
        <div className="flex items-center justify-center">
          <MinusCircle className={`${iconSize} text-gray-400`} />
        </div>
      );
    default:
      return null;
  }
}

export function StatusBadge({ status }: { status: "up" | "down" | "na" }) {
  const variants = {
    up: "bg-green-100 text-green-800 border-green-200",
    down: "bg-red-100 text-red-800 border-red-200",
    na: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const labels = {
    up: "Online",
    down: "Offline",
    na: "N/A",
  };

  return (
    <Badge className={`${variants[status]} border`}>{labels[status]}</Badge>
  );
}
