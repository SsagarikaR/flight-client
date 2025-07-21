import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flightClients } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "../components/status/StatusIndicator";
import {
  ArrowLeft,
  Server,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Download,
  Clock,
  Activity,
} from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const clientId = Number.parseInt(params.id as string);

  const [refreshing, setRefreshing] = useState(false);

  const client = useMemo(() => {
    return flightClients.find((c) => c.id === clientId);
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Client Not Found</h2>
            <p className="text-gray-600 mb-4">
              The requested client could not be found.
            </p>
            <Button onClick={() => navigate("/status")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
  const totalServices = serviceEntries.length;

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleExportReport = () => {
    // Create a simple text report
    const report = `
      Service Status Report - ${client.name}
      Generated: ${new Date().toLocaleString()}
      =====================================
      
      Summary:
      - Total Services: ${totalServices}
      - Online: ${upServices}
      - Offline: ${downServices}
      - N/A: ${naServices}
      
      Detailed Status:
      ${serviceEntries
        .map(
          ([name, service]) => `
      ${name}:
        Status: ${service.status.toUpperCase()}
        Address: ${service.address || "N/A"}
        Details: ${service.details}
      `
        )
        .join("")}
          `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${client.name.replace(/\s+/g, "_")}_status_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[70%] mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/status")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {client.name}
                  </h1>
                  <p className="text-gray-600">Service Status Overview</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExportReport}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>

              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[70%] mx-auto px-4 py-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices}</div>
              <p className="text-xs text-muted-foreground">
                Monitored services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Online Services
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {upServices}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalServices > 0
                  ? ((upServices / totalServices) * 100).toFixed(1)
                  : 0}
                % operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Offline Services
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {downServices}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                N/A Services
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {naServices}
              </div>
              <p className="text-xs text-muted-foreground">Not applicable</p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span>Auto-refresh: Every 30 seconds</span>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Service Status Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceEntries.map(([serviceName, service]) => (
                <div
                  key={serviceName}
                  className="border rounded-lg p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <StatusIndicator status={service.status} size="lg" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {serviceName}
                        </h4>
                        {service.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <ExternalLink className="h-3 w-3" />
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {service.address}
                            </span>
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
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                      <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Status Details:
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.details}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional service info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Service Type:</span>
                        <span className="ml-2 font-medium">{serviceName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Check:</span>
                        <span className="ml-2 font-medium">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
