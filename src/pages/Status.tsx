import { useState, useMemo } from "react";
import AppTable, { type ColumnConfig } from "../components/AppTable";
import {
  StatusIndicator,
  StatusBadge,
} from "../components/status/StatusIndicator";
// import { ServiceDetailsModal } from "../components/status/ServiceDetailModal";
import { flightClients, type FlightClient } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Server, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function FlightStatusApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "name",
    order: "asc",
  });
  // const [selectedClient, setSelectedClient] = useState<FlightClient | null>(
  //   null
  // );
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = flightClients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof FlightClient];
        const bValue = b[sortConfig.key as keyof FlightClient];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filtered;
  }, [searchQuery, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredAndSortedData.slice(startIndex, startIndex + limit);
  }, [filteredAndSortedData, page, limit]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    let totalServices = 0;
    let upServices = 0;
    let downServices = 0;
    let naServices = 0;

    flightClients.forEach((client) => {
      Object.values(client.services).forEach((service) => {
        totalServices++;
        if (service.status === "up") upServices++;
        else if (service.status === "down") downServices++;
        else naServices++;
      });
    });

    return { totalServices, upServices, downServices, naServices };
  }, []);

  const columns: ColumnConfig[] = [
    {
      id: "name",
      label: "Client Name",
      width: 25,
      minWidth: 180,
      sortable: true,
      defaultSort: true,
    },
    {
      id: "ftp",
      label: "FTP Server",
      width: 12,
      minWidth: 100,
      align: "center",
    },
    {
      id: "odata",
      label: "OData API",
      width: 12,
      minWidth: 100,
      align: "center",
    },
    {
      id: "legacy",
      label: "Legacy Service",
      width: 12,
      minWidth: 120,
      align: "center",
    },
    {
      id: "backend",
      label: "Node.js Backend",
      width: 12,
      minWidth: 130,
      align: "center",
    },
    {
      id: "devserver",
      label: "Dev Server",
      width: 12,
      minWidth: 100,
      align: "center",
    },
    {
      id: "overall",
      label: "Overall Status",
      width: 10,
      minWidth: 120,
      align: "center",
    },
    {
      id: "action",
      label: "Actions",
      width: 5,
      minWidth: 80,
      align: "center",
    },
  ];

  const handleSort = (columnId: string, order: "asc" | "desc") => {
    setSortConfig({ key: columnId, order });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleViewDetails = () => {
    // navigate(`/status/${client.id}`);
    // setSelectedClient(client);
    // setIsModalOpen(true);
  };

  const getOverallStatus = (client: FlightClient): "up" | "down" | "na" => {
    const services = Object.values(client.services);
    const upCount = services.filter((s) => s.status === "up").length;
    const downCount = services.filter((s) => s.status === "down").length;

    if (upCount > 0 && downCount === 0) return "up";
    if (downCount > 0) return "down";
    return "na";
  };

  const renderRow = (client: FlightClient, columns: ColumnConfig[]) => (
    <div
      key={client.id}
      className="flex items-center px-4 py-4 hover:bg-blue-50/50 transition-colors"
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className="px-2 flex-shrink-0"
          style={{
            width: `${column.width}%`,
            minWidth: `${column.minWidth || Math.max(column.width * 8, 100)}px`,
            textAlign: column.align || "left",
          }}
        >
          {column.id === "name" && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {client.name}
              </span>
            </div>
          )}

          {column.id === "ftp" && (
            <StatusIndicator
              status={client.services["FTP Server"]?.status || "na"}
            />
          )}

          {column.id === "odata" && (
            <StatusIndicator
              status={client.services["FileMaker OData API"]?.status || "na"}
            />
          )}

          {column.id === "legacy" && (
            <StatusIndicator
              status={client.services["Legacy Service"]?.status || "na"}
            />
          )}

          {column.id === "backend" && (
            <StatusIndicator
              status={client.services["Node.js Backend"]?.status || "na"}
            />
          )}

          {column.id === "devserver" && (
            <StatusIndicator
              status={client.services["Node.js Dev Server"]?.status || "na"}
            />
          )}

          {column.id === "overall" && (
            <StatusBadge status={getOverallStatus(client)} />
          )}

          {column.id === "action" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails()}
              className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full lg:max-w-[85%] mx-auto px-4 py-6">
          <div className="flex items-center ">
            <div className=" rounded-lg flex items-center justify-center flex-shrink-0">
              {/* <Activity className="h-6 w-6 text-white" /> */}
              <img src={Logo} className="h-22 w-22" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Flight Service Status Monitor
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                Real-time monitoring of airline service infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full lg:max-w-[85%] mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Services
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {overallStats.totalServices}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Online Services
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {overallStats.upServices}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  (overallStats.upServices / overallStats.totalServices) *
                  100
                ).toFixed(1)}
                % uptime
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Offline Services
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {overallStats.downServices}
              </div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                N/A Services
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-gray-400 flex-shrink-0"></div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-600">
                {overallStats.naServices}
              </div>
              <p className="text-xs text-muted-foreground">Not applicable</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <AppTable
          columns={columns}
          data={paginatedData}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalCount={filteredAndSortedData.length}
          loading={false}
          emptyMessage="No flight clients found"
          renderRow={renderRow}
          onSort={handleSort}
          onSearch={handleSearch}
          className="shadow-lg"
        />

        {/* Service Details Modal */}
        {/* <ServiceDetailsModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        /> */}
      </div>
    </div>
  );
}
