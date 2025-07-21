import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnConfig {
  id: string;
  label: string;
  width: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  defaultSort?: boolean;
  minWidth?: number; // Add minimum width for responsive behavior
}

export interface AppTableProps<T> {
  columns: ColumnConfig[];
  data: T[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalCount: number;
  loading?: boolean;
  emptyMessage?: string;
  renderRow: (item: T, columns: ColumnConfig[]) => React.ReactNode;
  onSort?: (columnId: string, order: "asc" | "desc") => void;
  onSearch?: (query: string) => void;
  showPagination?: boolean;
  showSearch?: boolean;
  className?: string;
}

export default function AppTable<T extends { id: number | string }>({
  columns,
  data,
  page,
  setPage,
  limit,
  setLimit,
  totalCount,
  loading = false,
  emptyMessage = "No data available",
  renderRow,
  onSort,
  onSearch,
  showPagination = true,
  showSearch = true,
  className = "",
}: AppTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key?: string;
    order?: "asc" | "desc";
  }>(() => {
    const defaultSortColumn =
      columns.find((col) => col.sortable && col.defaultSort) ||
      columns.find((col) => col.sortable);
    return defaultSortColumn
      ? { key: defaultSortColumn.id, order: "desc" }
      : {};
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      const newOrder =
        prev.key === columnId && prev.order === "asc" ? "desc" : "asc";
      if (onSort) {
        onSort(columnId, newOrder);
      }
      return { key: columnId, order: newOrder };
    });
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Calculate minimum table width based on columns
  const minTableWidth = columns.reduce((total, col) => {
    return total + (col.minWidth || Math.max(col.width * 8, 100)); // Fallback min width
  }, 0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Search and Controls */}
      {showSearch && (
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                  >
                    <span className="truncate">
                      Sort by:{" "}
                      {columns.find((col) => col.id === sortConfig.key)
                        ?.label || "None"}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columns
                    .filter((col) => col.sortable)
                    .map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {sortConfig.key && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sortConfig.key && handleSort(sortConfig.key)}
                  className="flex-shrink-0"
                >
                  {sortConfig.order === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${minTableWidth}px` }}>
          {/* Table Header */}
          <div className="bg-slate-100 border-b">
            <div className="flex items-center px-4 py-3">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`px-2 font-semibold text-sm text-gray-700 flex-shrink-0 ${
                    column.sortable ? "cursor-pointer hover:text-gray-900" : ""
                  }`}
                  style={{
                    width: `${column.width}%`,
                    minWidth: `${
                      column.minWidth || Math.max(column.width * 8, 100)
                    }px`,
                    textAlign: column.align || "left",
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="inline-flex items-center gap-1">
                    <span className="truncate">{column.label}</span>
                    {column.sortable &&
                      sortConfig.key === column.id &&
                      (sortConfig.order === "asc" ? (
                        <ArrowUp className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <ArrowDown className="h-3 w-3 flex-shrink-0" />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : data.length > 0 ? (
              data.map((item) => renderRow(item, columns))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && totalCount > 0 && (
        <div className="flex  sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-t bg-gray-50/50 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>

          <div className="flex   items-center gap-4">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {totalCount > 0 ? (page - 1) * limit + 1 : 0} -{" "}
              {Math.min(page * limit, totalCount)} of {totalCount}
            </span>

            <div className="flex items-center gap-1 ">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                className="cursor-pointer"
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className="cursor-pointer"
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
