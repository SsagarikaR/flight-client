import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "./StatusIndicator";
import type { FlightClient } from "../../utils/data";
import { ExternalLink, Server, AlertCircle } from "lucide-react";

interface ServiceDetailsModalProps {
  client: FlightClient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceDetailsModal({
  client,
  isOpen,
  onClose,
}: ServiceDetailsModalProps) {
  if (!client) return null;

  const serviceEntries = Object.entries(client.services);
  const upServices = serviceEntries.filter(
    ([_, service]) => service.status === "up"
  ).length;
  const downServices = serviceEntries.filter(
    ([_, service]) => service.status === "down"
  ).length;
  const naServices = serviceEntries.filter(
    ([_, service]) => service.status === "na"
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {client.name} - Service Details
          </DialogTitle>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Online Services
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {upServices}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <StatusIndicator status="up" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">
                  Offline Services
                </p>
                <p className="text-2xl font-bold text-red-700">
                  {downServices}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <StatusIndicator status="down" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  N/A Services
                </p>
                <p className="text-2xl font-bold text-gray-700">{naServices}</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <StatusIndicator status="na" />
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Status Details</h3>

          {serviceEntries.map(([serviceName, service]) => (
            <div
              key={serviceName}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <StatusIndicator status={service.status} />
                  <div>
                    <h4 className="font-medium">{serviceName}</h4>
                    {service.address && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="font-mono">{service.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  className={
                    service.status === "up"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : service.status === "down"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                >
                  {service.status === "up"
                    ? "Online"
                    : service.status === "down"
                    ? "Offline"
                    : "N/A"}
                </Badge>
              </div>

              {service.details && (
                <div className="flex items-start gap-2 mt-3 p-3 bg-gray-50 rounded border-l-4 border-l-gray-300">
                  <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{service.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
