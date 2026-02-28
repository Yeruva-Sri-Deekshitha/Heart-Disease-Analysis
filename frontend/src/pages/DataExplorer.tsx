import { useState, useMemo } from "react";
import { useAllPatients } from "../hooks/useQueries";
import PatientTable from "../components/PatientTable";
import PaginationControl from "../components/Pagination";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { type Patient } from "../backend";

const PAGE_SIZE = 25;

export default function DataExplorer() {
  const { data: patients, isLoading, isError, error, refetch } = useAllPatients();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Patient>("age");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const safePatients = patients ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return safePatients;
    return safePatients.filter((p) => {
      return (
        String(p.age).includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        p.race.toLowerCase().includes(q) ||
        p.chestPain.toLowerCase().includes(q) ||
        p.thal.toLowerCase().includes(q)
      );
    });
  }, [safePatients, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "bigint" && typeof bVal === "bigint") {
        return sortDir === "asc" ? Number(aVal - bVal) : Number(bVal - aVal);
      }
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortDir === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filtered, sortKey, sortDir]);

  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key: keyof Patient) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-sora text-foreground">Data Explorer</h1>
          <p className="text-muted-foreground mt-1">
            Browse, search, and sort all{" "}
            {isLoading ? "..." : safePatients.length} patient records
          </p>
        </div>

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load patient data</AlertTitle>
            <AlertDescription className="flex items-center gap-3 mt-2">
              <span>{error instanceof Error ? error.message : "An unexpected error occurred."}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()} className="shrink-0">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by age, gender, race, chest pain…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Loading…
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <>
            {sorted.length === 0 && !isError ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">No records found</p>
                <p className="text-sm mt-1">Try adjusting your search query.</p>
              </div>
            ) : (
              <>
                <PatientTable
                  patients={paginated}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <PaginationControl
                  totalItems={sorted.length}
                  itemsPerPage={PAGE_SIZE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
