// import { useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { flightClients } from "../utils/data";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { StatusIndicator } from "../components/status/StatusIndicator";
// import {
//   ArrowLeft,
//   Server,
//   AlertCircle,
//   ExternalLink,
//   RefreshCw,
//   Download,
//   Clock,
//   Activity,
// } from "lucide-react";

// export default function ClientDetailPage() {
//   const params = useParams();
//   const navigate = useNavigate();
//   const clientId = Number.parseInt(params.id as string);

//   const [refreshing, setRefreshing] = useState(false);

//   const client = useMemo(() => {
//     return flightClients.find((c) => c.id === clientId);
//   }, [clientId]);

//   if (!client) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <Card className="w-96">
//           <CardContent className="p-6 text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Client Not Found</h2>
//             <p className="text-gray-600 mb-4">
//               The requested client could not be found.
//             </p>
//             <Button onClick={() => navigate("/status")}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const serviceEntries = Object.entries(client.services);
//   const upServices = serviceEntries.filter(
//     ([_, service]) => service.status === "up"
//   ).length;
//   const downServices = serviceEntries.filter(
//     ([_, service]) => service.status === "down"
//   ).length;
//   const naServices = serviceEntries.filter(
//     ([_, service]) => service.status === "na"
//   ).length;
//   const totalServices = serviceEntries.length;

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     setRefreshing(false);
//   };

//   const handleExportReport = () => {
//     // Create CSV header
//     const csvHeader = "Service Name,Status,Address,Details,Timestamp\n";

//     // Create CSV rows
//     const csvRows = serviceEntries
//       .map(([name, service]) => {
//         // Escape commas and quotes in fields by wrapping in quotes
//         const escapeCsv = (field: string) => {
//           if (!field) return '""';
//           const str = String(field);
//           if (str.includes(",") || str.includes('"') || str.includes("\n")) {
//             return `"${str.replace(/"/g, '""')}"`;
//           }
//           return str;
//         };

//         return [
//           escapeCsv(name),
//           escapeCsv(service.status.toUpperCase()),
//           escapeCsv(service.address || "N/A"),
//           escapeCsv(service.details || "N/A"),
//           escapeCsv(new Date().toLocaleString()),
//         ].join(",");
//       })
//       .join("\n");

//     const csvContent = csvHeader + csvRows;

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${client.name.replace(/\s+/g, "_")}_status_report.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[75%] mx-auto px-4 py-6">
//           <div className="flex md:flex-row flex-col items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 onClick={() => navigate("/status")}
//                 className="hover:bg-gray-100"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Home
//               </Button>

//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Server className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {client.name}
//                   </h1>
//                   <p className="text-gray-600">Service Status Overview</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 onClick={handleExportReport}
//                 className="flex items-center gap-2 bg-transparent"
//               >
//                 <Download className="h-4 w-4" />
//                 Export Report
//               </Button>

//               <Button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
//                 />
//                 {refreshing ? "Refreshing..." : "Refresh"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className=" max-w-[95%] sm:max-w-[85%] md:max-w-[75%] mx-auto px-4 py-8">
//         {/* Summary Statistics */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Services
//               </CardTitle>
//               <Activity className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{totalServices}</div>
//               <p className="text-xs text-muted-foreground">
//                 Monitored services
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Online Services
//               </CardTitle>
//               <div className="h-4 w-4 rounded-full bg-green-500"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {upServices}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {totalServices > 0
//                   ? ((upServices / totalServices) * 100).toFixed(1)
//                   : 0}
//                 % operational
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Offline Services
//               </CardTitle>
//               <AlertCircle className="h-4 w-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-600">
//                 {downServices}
//               </div>
//               <p className="text-xs text-muted-foreground">Need attention</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 N/A Services
//               </CardTitle>
//               <div className="h-4 w-4 rounded-full bg-gray-400"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-600">
//                 {naServices}
//               </div>
//               <p className="text-xs text-muted-foreground">Not applicable</p>
//             </CardContent>
//           </Card>
//         </div>
//         {/* Last Updated Info */}
//         <div className="mb-4 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Clock className="h-4 w-4" />
//             <span>Last updated: {new Date().toLocaleString()}</span>
//           </div>
//           <div className="flex items-center gap-1 text-xs text-gray-500">
//             <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span>Auto-refresh: 30s</span>
//           </div>
//         </div>

//         {/* Service Details - Compact Layout */}
//         <Card>
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold">
//               Service Status Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="divide-y divide-gray-100">
//               {serviceEntries.map(([serviceName, service]) => (
//                 <div
//                   key={serviceName}
//                   className="px-6 py-4 hover:bg-gray-50/50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <StatusIndicator status={service.status} size="sm" />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-3">
//                           <h4 className="font-medium text-gray-900 truncate">
//                             {serviceName}
//                           </h4>
//                           {service.address && (
//                             <div className="flex items-center gap-1 text-xs text-gray-500">
//                               <ExternalLink className="h-3 w-3" />
//                               <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[200px]">
//                                 {service.address}
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {service.details && (
//                           <p className="text-sm text-gray-600 mt-1 line-clamp-1">
//                             {service.details}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 ml-4">
//                       <div className="text-right text-xs text-gray-500">
//                         <div>{new Date().toLocaleTimeString()}</div>
//                       </div>
//                       <Badge
//                         variant="secondary"
//                         className={
//                           service.status === "up"
//                             ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
//                             : service.status === "down"
//                             ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
//                             : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"
//                         }
//                       >
//                         {service.status === "up"
//                           ? "Online"
//                           : service.status === "down"
//                           ? "Offline"
//                           : "N/A"}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const clientId = Number.parseInt(params.id as string);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );

  const client = useMemo(() => {
    return flightClients.find((c) => c.id === clientId);
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Client Not Found</h2>
            <p className="text-gray-600 mb-4">
              The requested client could not be found.
            </p>
            <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleExportReport = () => {
    const csvHeader = "Service Name,Status,Address,Details,Timestamp\n";
    const csvRows = serviceEntries
      .map(([name, service]) => {
        const escapeCsv = (field: string) => {
          if (!field) return '""';
          const str = String(field);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        return [
          escapeCsv(name),
          escapeCsv(service.status.toUpperCase()),
          escapeCsv(service.address || "N/A"),
          escapeCsv(service.details || "N/A"),
          escapeCsv(new Date().toLocaleString()),
        ].join(",");
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${client.name.replace(/\s+/g, "_")}_status_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleServiceExpansion = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Header */}
          <div className="flex flex-col space-y-4 sm:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="hover:bg-gray-100 p-2"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  className="p-2 bg-transparent"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2"
                  size="sm"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Server className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {client.name}
                </h1>
                <p className="text-sm text-gray-600">Service Status</p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total
              </CardTitle>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {totalServices}
              </div>
              <p className="text-xs text-muted-foreground">Services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Online
              </CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {upServices}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalServices > 0
                  ? ((upServices / totalServices) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Offline
              </CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {downServices}
              </div>
              <p className="text-xs text-muted-foreground">Issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                N/A
              </CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-400"></div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-gray-600">
                {naServices}
              </div>
              <p className="text-xs text-muted-foreground">Not used</p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-200/50 gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-refresh: 30s</span>
          </div>
        </div>

        {/* Service Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Service Status Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {serviceEntries.map(([serviceName, service]) => {
                const isExpanded = expandedServices.has(serviceName);
                return (
                  <div key={serviceName} className="transition-colors">
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div
                        className="px-4 py-4 hover:bg-gray-50/50 cursor-pointer"
                        onClick={() => toggleServiceExpansion(serviceName)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <StatusIndicator
                              status={service.status}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {serviceName}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge
                              className={
                                service.status === "up"
                                  ? "bg-green-100 text-green-700 border-green-200 text-xs"
                                  : service.status === "down"
                                  ? "bg-red-100 text-red-700 border-red-200 text-xs"
                                  : "bg-gray-100 text-gray-600 border-gray-200 text-xs"
                              }
                            >
                              {service.status === "up"
                                ? "Online"
                                : service.status === "down"
                                ? "Offline"
                                : "N/A"}
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Details for Mobile */}
                        {isExpanded && (
                          <div className="mt-3 pl-7 space-y-2">
                            {service.address && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded break-all">
                                  {service.address}
                                </span>
                              </div>
                            )}
                            {service.details && (
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {service.details}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Last check: {new Date().toLocaleTimeString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <StatusIndicator status={service.status} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {serviceName}
                              </h4>
                              {service.address && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <ExternalLink className="h-3 w-3" />
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                                    {service.address}
                                  </span>
                                </div>
                              )}
                            </div>
                            {service.details && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {service.details}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right text-xs text-gray-500 hidden lg:block">
                            <div>{new Date().toLocaleTimeString()}</div>
                          </div>
                          <Badge
                            className={
                              service.status === "up"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : service.status === "down"
                                ? "bg-red-100 text-red-700 border-red-200"
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
